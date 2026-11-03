import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf-8');

const target = `    function copiarMencionAlAire() {
      const scriptEl = document.getElementById('prompter-active-script');
      if (!scriptEl) return;
      const text = scriptEl.innerText.replace(/[“”"]/g, '').trim();

      navigator.clipboard.writeText(text).then(() => {
        pillsReadSession++;
        const badge = document.getElementById('prompter-read-count-badge');
        if (badge) badge.innerText = \`Menciones leídas en este juego: \${pillsReadSession}\`;

        const btnCopy = document.getElementById('btn-prompter-copy');
        const lblCopy = document.getElementById('lbl-prompter-copy');
        if (btnCopy) btnCopy.style.background = '#10B981';
        if (btnCopy) btnCopy.style.color = '#FFFFFF';
        if (lblCopy) lblCopy.innerText = '¡Copiado al Aire! ✓';

        setTimeout(() => {
          if (btnCopy) btnCopy.style.background = '#FFFFFF';
          if (btnCopy) btnCopy.style.color = '#0A0D14';
          if (lblCopy) lblCopy.innerText = 'Copiar Mención (1-Clic)';
        }, 2000);

        // Incrementar en Firestore para el comentarista activo
        if (window.firestoreDb && activeCommentatorId) {
          try {
            const inc = (typeof firebase !== 'undefined' && firebase.firestore) 
              ? firebase.firestore.FieldValue.increment(1) 
              : 1;
            window.firestoreDb.collection('commentators').doc(activeCommentatorId).update({
              'stats.pillsRead': inc
            }).catch(()=>{});
          } catch(e){}
        }

        if (typeof mostrarToast === 'function') mostrarToast('🎙️ Cuña copiada al portapapeles. ¡Al aire!');
      }).catch(err => {
        console.warn('Error al copiar al portapapeles:', err);
      });
    }`;

const replacement = `    function copiarMencionAlAire() {
      const scriptEl = document.getElementById('prompter-active-script');
      if (!scriptEl) return;
      const text = scriptEl.innerText.replace(/[“”"]/g, '').trim();

      function notifySuccess() {
        pillsReadSession++;
        const badge = document.getElementById('prompter-read-count-badge');
        if (badge) badge.innerText = \`Menciones leídas en este juego: \${pillsReadSession}\`;

        const btnCopy = document.getElementById('btn-prompter-copy');
        const lblCopy = document.getElementById('lbl-prompter-copy');
        if (btnCopy) btnCopy.style.background = '#10B981';
        if (btnCopy) btnCopy.style.color = '#FFFFFF';
        if (lblCopy) lblCopy.innerText = '¡Copiado al Aire! ✓';

        setTimeout(() => {
          if (btnCopy) btnCopy.style.background = '#FFFFFF';
          if (btnCopy) btnCopy.style.color = '#0A0D14';
          if (lblCopy) lblCopy.innerText = 'Copiar Mención (1-Clic)';
        }, 2000);

        // Incrementar en Firestore para el comentarista activo
        if (window.firestoreDb && activeCommentatorId) {
          try {
            const inc = (typeof firebase !== 'undefined' && firebase.firestore) 
              ? firebase.firestore.FieldValue.increment(1) 
              : 1;
            window.firestoreDb.collection('commentators').doc(activeCommentatorId).update({
              'stats.pillsRead': inc
            }).catch(()=>{});
          } catch(e){}
        }

        if (typeof mostrarToast === 'function') mostrarToast('🎙️ Cuña copiada al portapapeles. ¡Al aire!');
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(notifySuccess).catch(() => {
          try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            notifySuccess();
          } catch(e) {
            notifySuccess();
          }
        });
      } else {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          notifySuccess();
        } catch(e) {
          notifySuccess();
        }
      }
    }`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log('✓ Fallback de copiado agregado exitosamente.');
} else {
  console.log('Target no encontrado.');
}
