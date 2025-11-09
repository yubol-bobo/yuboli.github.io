// Word Cloud functionality for impressions page with Firebase
(function() {
  'use strict';

  const MAX_FONT_SIZE = 48;
  const MIN_FONT_SIZE = 14;
  
  // Color palette for words (theme-aware)
  const COLORS = [
    '#4A90E2', '#E94B3C', '#50C878', '#9B59B6', 
    '#F39C12', '#1ABC9C', '#E74C3C', '#3498DB',
    '#2ECC71', '#F1C40F', '#E67E22', '#95A5A6'
  ];

  let wordData = {};
  let db = null;
  let isFirebaseReady = false;

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDSHfmz7eCGcAy7iCAr_XnelFZNGdN_U9w",
    authDomain: "word-cloud-239c3.firebaseapp.com",
    databaseURL: "https://word-cloud-239c3-default-rtdb.firebaseio.com",
    projectId: "word-cloud-239c3",
    storageBucket: "word-cloud-239c3.firebasestorage.app",
    messagingSenderId: "497097581103",
    appId: "1:497097581103:web:97eb13f7b34201b9989cda",
    measurementId: "G-5HKW03SJD1"
  };

  // Initialize
  function init() {
    initFirebase();
    attachEventListeners();
  }

  // Initialize Firebase
  function initFirebase() {
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded. Please check your internet connection.');
      showFeedback('⚠️ Connection unavailable. Using local mode.', 'error');
      isFirebaseReady = false;
      wordData = {};
      renderCloud();
      updateStats();
      return;
    }

    try {
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      
      db = firebase.database();
      isFirebaseReady = true;
      
      // Listen for real-time updates
      loadDataFromFirebase();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      showFeedback('⚠️ Could not connect to database. Using local mode.', 'error');
      isFirebaseReady = false;
      wordData = {};
      renderCloud();
      updateStats();
    }
  }

  // Load data from Firebase
  function loadDataFromFirebase() {
    if (!db) return;

    const wordsRef = db.ref('impressions/words');
    
    // Listen for real-time updates
    wordsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      wordData = data || {};
      renderCloud();
      updateStats();
    }, (error) => {
      console.error('Error loading data:', error);
      showFeedback('⚠️ Could not load data from server.', 'error');
    });
  }

  // Save data to Firebase
  function saveDataToFirebase(word, increment = 1) {
    if (!db || !isFirebaseReady) return;

    const wordRef = db.ref(`impressions/words/${word}`);
    
    // Use transaction to safely increment the counter
    wordRef.transaction((currentValue) => {
      return (currentValue || 0) + increment;
    }, (error, committed, snapshot) => {
      if (error) {
        console.error('Transaction failed:', error);
        showFeedback('❌ Failed to save. Please try again.', 'error');
      } else if (!committed) {
        console.log('Transaction not committed');
      }
      // Success is handled by the real-time listener
    });
  }

  // Attach event listeners
  function attachEventListeners() {
    const input = document.getElementById('impressionInput');
    const submitBtn = document.getElementById('submitBtn');
    const charCount = document.getElementById('charCount');

    if (!input || !submitBtn) return;

    // Character counter
    input.addEventListener('input', function() {
      if (charCount) {
        charCount.textContent = this.value.length;
      }
    });

    // Submit on Enter key
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitImpression();
      }
    });

    // Submit on button click
    submitBtn.addEventListener('click', submitImpression);
  }

  // Submit new impression
  function submitImpression() {
    const input = document.getElementById('impressionInput');
    if (!input) return;

    const text = input.value.trim();
    
    if (!text) {
      showFeedback('Please enter at least one word!', 'error');
      return;
    }

    // Split by commas and/or spaces, clean up
    const words = text
      .toLowerCase()
      .split(/[,\s]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .filter(w => !isStopWord(w)); // Filter out common stop words

    if (words.length === 0) {
      showFeedback('Please enter meaningful words!', 'error');
      return;
    }

    // Add words to Firebase
    if (isFirebaseReady) {
      words.forEach(word => {
        saveDataToFirebase(word, 1);
      });
      
      // Clear input and show feedback
      input.value = '';
      document.getElementById('charCount').textContent = '0';
      
      const wordCount = words.length;
      showFeedback(`✅ Added ${wordCount} word${wordCount > 1 ? 's' : ''}! Thank you!`, 'success');
    } else {
      showFeedback('❌ Cannot save: Not connected to server.', 'error');
    }
  }

  // Simple stop words filter (common words to ignore)
  function isStopWord(word) {
    const stopWords = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 
                       'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                       'would', 'could', 'should', 'may', 'might', 'can', 'of', 'at',
                       'by', 'for', 'with', 'about', 'as', 'into', 'through', 'to',
                       'from', 'in', 'on', 'and', 'or', 'but'];
    return stopWords.includes(word.toLowerCase());
  }

  // Show feedback message
  function showFeedback(message, type) {
    const existingFeedback = document.querySelector('.feedback-message');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? '#2ECC71' : '#E74C3C'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 600;
    `;

    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }

  // Calculate font size based on frequency
  function calculateFontSize(count, maxCount) {
    if (maxCount === 1) return MIN_FONT_SIZE + 10;
    
    const ratio = count / maxCount;
    const size = MIN_FONT_SIZE + (MAX_FONT_SIZE - MIN_FONT_SIZE) * ratio;
    return Math.round(size);
  }

  // Render the word cloud
  function renderCloud() {
    const cloudContainer = document.getElementById('wordCloud');
    if (!cloudContainer) return;

    const words = Object.keys(wordData);
    
    if (words.length === 0) {
      cloudContainer.innerHTML = '<div class="empty-state">Be the first to share your impression! 🌟</div>';
      return;
    }

    // Find max count for sizing
    const maxCount = Math.max(...Object.values(wordData));

    // Sort by frequency (descending) for better visual layout
    const sortedWords = words.sort((a, b) => wordData[b] - wordData[a]);

    // Clear container
    cloudContainer.innerHTML = '';

    // Create word elements
    sortedWords.forEach((word, index) => {
      const count = wordData[word];
      const fontSize = calculateFontSize(count, maxCount);
      const color = COLORS[index % COLORS.length];

      const wordElement = document.createElement('span');
      wordElement.className = 'word-item';
      wordElement.textContent = word;
      wordElement.style.fontSize = `${fontSize}px`;
      wordElement.style.color = color;
      wordElement.title = `${word}: mentioned ${count} time${count > 1 ? 's' : ''}`;
      
      // Add a subtle animation delay
      wordElement.style.animation = `fadeIn 0.5s ease-out ${index * 0.05}s both`;

      cloudContainer.appendChild(wordElement);
    });

    // Add CSS animation if not already present
    if (!document.getElementById('wordCloudAnimations')) {
      const style = document.createElement('style');
      style.id = 'wordCloudAnimations';
      style.textContent = `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Update statistics
  function updateStats() {
    const totalWordsEl = document.getElementById('totalWords');
    const totalSubmissionsEl = document.getElementById('totalSubmissions');

    if (totalWordsEl) {
      totalWordsEl.textContent = Object.keys(wordData).length;
    }

    if (totalSubmissionsEl) {
      const total = Object.values(wordData).reduce((sum, count) => sum + count, 0);
      totalSubmissionsEl.textContent = total;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
