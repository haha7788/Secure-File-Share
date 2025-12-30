import { ref } from 'vue';

export function useClipboard(feedbackDuration = 2000) {
  const copied = ref(false);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, feedbackDuration);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  };

  return { copied, copy };
}