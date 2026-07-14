// Editor rico (Toast UI Editor) usado nas páginas /admin/publicar e /admin/editar.
// WYSIWYG + Markdown: o conteúdo final é sempre Markdown, formato dos posts do blog.
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/i18n/pt-br';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { getSavedKey, uploadImage } from './api.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Extensão de arquivo a partir do MIME type (para imagens coladas/arrastadas sem nome). */
function extFromType(type) {
  const ext = (type || '').split('/')[1] || 'png';
  return ext === 'jpeg' ? 'jpg' : ext;
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

  return new Editor({
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
          callback(res.path, name.replace(/\.[^.]+$/, ''));
          onStatus('ok', `Imagem enviada: ${res.path} (aparece no site após o build, em 1–2 min).`);
        } catch (e) {
          onStatus('err', `Falha ao enviar imagem: ${e.message}`);
        }
      },
    },
  });
}
