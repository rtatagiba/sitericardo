// Editor rico (Toast UI Editor) usado nas páginas /admin/publicar e /admin/editar.
// WYSIWYG + Markdown: o conteúdo final é sempre Markdown, formato dos posts do blog.
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/i18n/pt-br';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { getSavedKey, uploadImage } from './api.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Imagens enviadas nesta sessão: caminho no site (/images/...) -> object URL local.
// O caminho remoto só existe após o build, então a prévia usa o arquivo local.
const previewUrls = new Map();

/** Extensão de arquivo a partir do MIME type (para imagens coladas/arrastadas sem nome). */
function extFromType(type) {
  const ext = (type || '').split('/')[1] || 'png';
  return ext === 'jpeg' ? 'jpg' : ext;
}

/** Troca o src das <img> do editor pela prévia local quando o caminho remoto ainda não existe. */
function applyLocalPreviews(root) {
  for (const img of root.querySelectorAll('img')) {
    let path;
    try {
      path = new URL(img.src, location.href).pathname;
    } catch {
      continue;
    }
    const local = previewUrls.get(path);
    if (local && img.src !== local) {
      img.src = local;
      // Guarda o caminho real para inspeção (o Markdown continua com /images/...)
      img.dataset.sitePath = path;
    }
  }
}

/**
 * Cria o editor rico dentro de `el`.
 * @param {{
 *   el: HTMLElement,
 *   initialValue?: string,
 *   height?: string,
 *   onStatus?: (kind: 'ok' | 'err' | 'info', msg: string) => void,
 * }} options
 * @returns {Editor}
 */
export function createEditor({ el, initialValue = '', height = '560px', onStatus = () => {} }) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const editor = new Editor({
    el,
    height,
    initialValue,
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    usageStatistics: false,
    language: 'pt-BR',
    theme: prefersDark ? 'dark' : 'default',
    autofocus: false,
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
    ],
    hooks: {
      // Chamado ao inserir imagem pela toolbar, colar (Ctrl+V) ou arrastar para o editor.
      async addImageBlobHook(blob, callback) {
        if (!getSavedKey()) {
          onStatus('err', 'Informe a chave de API antes de inserir imagens.');
          return;
        }
        if (blob.size > MAX_IMAGE_BYTES) {
          onStatus('err', 'Imagem muito grande (máx. 5 MB). Otimize antes de subir.');
          return;
        }
        const name = blob.name || `imagem-${Date.now()}.${extFromType(blob.type)}`;
        const file = blob instanceof File ? blob : new File([blob], name, { type: blob.type });
        onStatus('info', `Enviando ${name} para o GitHub...`);
        try {
          const res = await uploadImage(file);
          previewUrls.set(res.path, URL.createObjectURL(file));
          callback(res.path, name.replace(/\.[^.]+$/, ''));
          onStatus('ok', `Imagem enviada: ${res.path} (no site após o build, em 1–2 min).`);
        } catch (e) {
          onStatus('err', `Falha ao enviar imagem: ${e.message}`);
        }
      },
    },
  });

  // O comando padrão de bloco de código não alterna de volta; substitui por um toggle.
  editor.addCommand('wysiwyg', 'codeBlock', (_payload, state, dispatch) => {
    const { codeBlock, paragraph } = state.schema.nodes;
    const { $from, from, to } = state.selection;
    const target = $from.parent.type === codeBlock ? paragraph : codeBlock;
    dispatch(state.tr.setBlockType(from, to, target));
    return true;
  });

  // Botão "código-fonte": alterna entre o modo visual e o Markdown (como o "code" do TinyMCE).
  const sourceBtn = document.createElement('button');
  sourceBtn.type = 'button';
  sourceBtn.textContent = 'MD';
  sourceBtn.className = 'toastui-editor-toolbar-icons';
  sourceBtn.style.cssText = 'background-image:none;font-size:13px;font-weight:700;line-height:1;';
  sourceBtn.setAttribute('aria-label', 'Código-fonte (Markdown)');
  sourceBtn.addEventListener('click', () => {
    editor.changeMode(editor.isMarkdownMode() ? 'wysiwyg' : 'markdown');
  });
  editor.on('changeMode', (mode) => {
    sourceBtn.classList.toggle('active', mode === 'markdown');
  });
  editor.insertToolbarItem(
    { groupIndex: 4, itemIndex: 2 },
    { el: sourceBtn, name: 'source', tooltip: 'Código-fonte (Markdown)' }
  );

  // Mantém a prévia local das imagens recém-enviadas (o src remoto quebraria até o build).
  const observer = new MutationObserver(() => applyLocalPreviews(el));
  observer.observe(el, { childList: true, subtree: true });

  return editor;
}
