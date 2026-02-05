const MOON_SVG = 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z';
const SUN_SVG = 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z';

const textTransformers = {
  upper: (text) => {
    if (text == null) return text;
    return text.toUpperCase();
  },

  lower: (text) => {
    if (text == null) return text;
    return text.toLowerCase();
  },

  sentence: (text) => {
    if (text == null) return text;
    return text.replace(/\p{L}/gu, (match, offset, string) => {
      const isSentenceStart = offset === 0 || /[.!?]\s*$/.test(string.substring(0, offset));
      if (isSentenceStart) {
        return match.toUpperCase();
      }
      return match.toLowerCase();
    });
  },

  title: (text) => {
    if (text == null) return text;
    return text.replace(/[a-zA-Zа-яА-ЯёЁ]+/g, (word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  },

  alternating: (text) => {
    if (text == null) return text;
    let result = '';
    let upperNext = true;
    for (let char of text) {
      if (/[a-zA-Zа-яА-ЯёЁ]/.test(char)) {
        result += upperNext ? char.toUpperCase() : char.toLowerCase();
        upperNext = !upperNext;
      } else {
        result += char;
      }
    }
    return result;
  },

  random: (text) => {
    if (text == null) return text;
    let result = '';
    for (let char of text) {
      if (/[a-zA-Zа-яА-ЯёЁ]/.test(char)) {
        result += Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
      } else {
        result += char;
      }
    }
    return result;
  }
};

async function loadTheme() {
  try {
    const result = await chrome.storage.local.get(['theme']);
    if (result.theme === 'dark') {
      document.body.classList.add('dark-theme');
      updateThemeIcon(true);
    }
  } catch (error) {
    console.error('Load theme error:', error);
  }
}

async function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  updateThemeIcon(isDark);
  
  try {
    await chrome.storage.local.set({ theme: isDark ? 'dark' : 'light' });
  } catch (error) {
    console.error('Save theme error:', error);
  }
}

function updateThemeIcon(isDark) {
  const pathElement = document.querySelector('.theme-icon path');
  if (pathElement) {
    pathElement.setAttribute('d', isDark ? SUN_SVG : MOON_SVG);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const resultText = document.getElementById('resultText');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const transformButtons = document.querySelectorAll('.transform-btn');

  if (!inputText || !resultText || !copyBtn || !clearBtn) {
    console.error('Required DOM elements not found');
    return;
  }

  if (transformButtons.length === 0) {
    console.error('No transform buttons found');
    return;
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  loadTheme();

  async function saveToStorage(input, result) {
    try {
      await chrome.storage.local.set({
        inputText: input,
        resultText: result
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  async function loadFromStorage() {
    try {
      const result = await chrome.storage.local.get(['inputText', 'resultText']);
      if (result.inputText) inputText.value = result.inputText;
      if (result.resultText) resultText.value = result.resultText;
    } catch (error) {
      console.error('Load error:', error);
    }
  }

  async function clearStorage() {
    try {
      await chrome.storage.local.remove(['inputText', 'resultText']);
    } catch (error) {
      console.error('Clear error:', error);
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  loadFromStorage();

  transformButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const transformType = btn.dataset.transform;
      const input = inputText.value;

      if (!input.trim()) {
        inputText.classList.add('shake');
        setTimeout(() => inputText.classList.remove('shake'), 500);
        return;
      }

      const transformer = textTransformers[transformType];
      if (!transformer) {
        console.error(`Unknown transform type: ${transformType}`);
        return;
      }

      try {
        const result = transformer(input);
        resultText.value = result;
        saveToStorage(input, result);
      } catch (error) {
        console.error('Transform failed:', error);
      }
    });
  });

  const debouncedSave = debounce(saveToStorage, 500);
  inputText.addEventListener('input', () => debouncedSave(inputText.value, resultText.value));
  resultText.addEventListener('input', () => debouncedSave(inputText.value, resultText.value));

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultText.value);
      copyBtn.classList.add('copy-success');
      setTimeout(() => {
        copyBtn.classList.remove('copy-success');
      }, 500);
    } catch (error) {
      console.error('Copy error:', error);
      alert('Failed to copy text');
    }
  });

  clearBtn.addEventListener('click', async () => {
    inputText.value = '';
    resultText.value = '';
    await clearStorage();
    clearBtn.classList.add('clear-success');
    setTimeout(() => {
      clearBtn.classList.remove('clear-success');
    }, 500);
  });
});
