import React, { useState, useEffect } from 'react';
import { ChevronRight, RotateCcw, Book, TrendingUp, Target, Zap } from 'lucide-react';

const EnglishQuickDrill = () => {
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stats, setStats] = useState({
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    wordsLearned: [],
    completedThemes: [],
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseFeedback, setExerciseFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Загрузка статистики из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('englishAppStats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  // Сохранение статистики
  useEffect(() => {
    localStorage.setItem('englishAppStats', JSON.stringify(stats));
  }, [stats]);

  const themes = [
    { id: 1, name: 'Daily Life', emoji: '☕', topics: ['Morning routines', 'Shopping', 'Eating & Drinking', 'Hobbies', 'Family', 'Home'] },
    { id: 2, name: 'Travel', emoji: '✈️', topics: ['Airport', 'Hotel', 'Directions', 'Transport', 'Weather', 'Time & Dates'] },
    { id: 3, name: 'Work & Studies', emoji: '💼', topics: ['Jobs', 'Office', 'School', 'Communication', 'Meetings', 'Work life'] },
    { id: 4, name: 'Social', emoji: '👥', topics: ['Making friends', 'Small talk', 'Relationships', 'Celebrations', 'Sports', 'Entertainment'] },
    { id: 5, name: 'Practical', emoji: '🛠️', topics: ['Restaurant', 'Doctor', 'Help', 'Lost & Found', 'Money', 'Problem solving'] },
  ];

  const generateMegaPrompt = () => {
    return `You are an English teacher using Oxford & Cambridge methodology for an A2-B1 (Elementary) level student. Your task is to create ONE quick drill session (5-10 minutes) focusing on:
1. Vocabulary with COLLOCATIONS (common phrases)
2. Sentence patterns for real communication
3. Automating speech through varied exercises

STRICT JSON FORMAT RESPONSE - ONLY JSON, no markdown, no explanations:
{
  "phase1_warmup": {
    "greeting": "friendly greeting in English",
    "question": "simple question to activate knowledge",
    "topic": "theme of today"
  },
  "phase2_content": {
    "type": "choose ONE: 'vocabulary_phrases' or 'sentence_patterns' or 'dialogue'",
    "vocabulary_phrases": [
      { 
        "word": "english_word", 
        "translation": "russian_translation", 
        "phonetic": "IPA",
        "collocations": [
          { "phrase": "common phrase with word", "meaning": "meaning in Russian", "example": "sentence using the phrase" },
          { "phrase": "another common phrase", "meaning": "meaning", "example": "example sentence" }
        ],
        "distinction": "similar word or antonym comparison",
        "casual_vs_formal": "how it differs in formal/informal speech"
      }
    ],
    "sentence_patterns": {
      "pattern": "main sentence construction pattern",
      "uses": {
        "statement": "I usually do X because Y",
        "question": "Do you usually do X?",
        "negative": "I don't usually do X",
        "emphasis": "You often do X, don't you?"
      },
      "examples": ["example 1", "example 2", "example 3"],
      "real_situations": ["situation 1 where used", "situation 2 where used"]
    },
    "dialogue": {
      "context": "situation description",
      "exchanges": [
        { "speaker": "A", "text": "English phrase", "translation": "Russian translation" }
      ],
      "key_phrases": [
        { "phrase": "phrase from dialogue", "meaning": "when to use it", "alternative": "similar phrase" }
      ]
    }
  },
  "phase3_exercises": [
    {
      "type": "phrase_matching",
      "instruction": "Match the phrase to the situation",
      "phrase": "I'm afraid not",
      "options": ["When you refuse politely", "When you're scared", "When you agree", "When you ask permission"],
      "correct_answer": "When you refuse politely",
      "explanation": "This is a polite way to say no in English"
    },
    {
      "type": "sentence_builder",
      "instruction": "Complete the sentence with your example",
      "pattern": "I usually ___ because ___",
      "user_answer_check": "Must contain subject, verb, and reason",
      "explanation": "You created a sentence using Present Simple and cause/effect"
    },
    {
      "type": "collocation_fill",
      "instruction": "Fill in the missing word in the phrase",
      "sentence": "I'd ___ a coffee, please",
      "correct_answer": "like",
      "explanation": "'I'd like' is a polite way to request something"
    },
    {
      "type": "transform_sentence",
      "instruction": "Rewrite using the new phrase",
      "original": "I don't like coffee",
      "hint": "Use 'prefer' instead",
      "correct_answer": "I prefer tea",
      "explanation": "'Prefer' is more formal than 'like'"
    },
    {
      "type": "situation_response",
      "instruction": "What would you say in this situation?",
      "situation": "Your friend asks: Do you like pizza?",
      "acceptable_answers": ["Yes, I do", "I really enjoy eating pizza", "Yes, pizza is delicious"],
      "explanation": "You should respond with yes/no + reason using new phrases"
    }
  ],
  "phase4_summary": {
    "key_phrases": ["phrase1", "phrase2", "phrase3"],
    "sentence_pattern_learned": "main pattern with examples",
    "collocation_tips": "most important collocations to remember",
    "motivation": "encouraging phrase"
  }
}`;
  };

  const startNewSession = async () => {
    setIsLoadingSession(true);
    setCurrentPhase(1);

    try {
      const prompt = generateMegaPrompt();
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [
            { 
              role: 'user', 
              content: prompt + '\n\nRespond ONLY with valid JSON, no markdown, no explanations. Start with { and end with }'
            }
          ],
        }),
      });

      const data = await response.json();
      let jsonText = data.content[0].text.trim();
      
      // Очистка от markdown
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const sessionData = JSON.parse(jsonText);
      setSession(sessionData);
      setCurrentExerciseIndex(0);
      setUserAnswer('');
    } catch (error) {
      console.error('Error generating session:', error);
      setSession(null);
    }
    setIsLoadingSession(false);
  };

  const checkAnswer = (answer) => {
    const exercise = session.phase3_exercises[currentExerciseIndex];
    let isCorrect = false;
    let explanation = exercise.explanation || "Great job!";

    // Проверка в зависимости от типа упражнения
    if (exercise.type === 'phrase_matching' || exercise.type === 'collocation_fill') {
      // Точная проверка
      isCorrect = answer.toLowerCase().trim() === exercise.correct_answer.toLowerCase().trim();
    } else if (exercise.type === 'sentence_builder') {
      // Проверяем наличие компонентов предложения
      const lowerAnswer = answer.toLowerCase();
      const hasSubject = lowerAnswer.includes('i ') || lowerAnswer.includes('you ') || lowerAnswer.includes('we ');
      const hasVerb = lowerAnswer.includes('do') || lowerAnswer.includes('go') || lowerAnswer.includes('play') || 
                      lowerAnswer.includes('eat') || lowerAnswer.includes('read') || lowerAnswer.includes('work');
      const hasBecause = lowerAnswer.includes('because') || lowerAnswer.includes('as') || lowerAnswer.includes('since');
      isCorrect = hasSubject && hasVerb && hasBecause;
      
      if (isCorrect) {
        explanation = "Perfect! You created a complete sentence with subject, verb, and reason!";
      } else {
        explanation = "Your sentence needs: subject (I, you, we...) + verb (do, go, play...) + reason (because...)";
      }
    } else if (exercise.type === 'transform_sentence') {
      // Более гибкая проверка для трансформации
      isCorrect = answer.toLowerCase().trim() === exercise.correct_answer.toLowerCase().trim();
      if (!isCorrect && exercise.hint) {
        explanation = `Expected something like: "${exercise.correct_answer}". ${exercise.explanation || ''}`;
      }
    } else if (exercise.type === 'situation_response') {
      // Проверяем наличие нужных компонентов в ответе
      const acceptableVariations = exercise.acceptable_answers.map(a => a.toLowerCase());
      isCorrect = acceptableVariations.some(variant => answer.toLowerCase().includes(variant.substring(0, 5)));
      if (isCorrect) {
        explanation = "Great! You responded naturally using the new phrases!";
      } else {
        explanation = exercise.explanation || "Try to use one of these responses: " + exercise.acceptable_answers.join(", ");
      }
    }
    
    setExerciseFeedback({
      isCorrect,
      explanation: explanation,
      correctAnswer: exercise.correct_answer,
    });
    setShowFeedback(true);

    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalAnswers: prev.totalAnswers + 1,
      }));
    } else {
      setStats(prev => ({
        ...prev,
        totalAnswers: prev.totalAnswers + 1,
      }));
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < session.phase3_exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setExerciseFeedback(null);
    } else {
      setCurrentPhase(4);
    }
  };

  const resetApp = () => {
    setShowNameInput(true);
    setUserName('');
    setCurrentPhase(null);
    setSession(null);
    setUserAnswer('');
    setShowFeedback(false);
    setExerciseFeedback(null);
  };

  // Фаза 0: Ввод имени
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
        `}</style>
        
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="text-6xl mb-6">🎓</div>
          <h1 className="title text-4xl font-bold text-gray-800 mb-2">English Quick Drill</h1>
          <p className="text-gray-600 mb-8 text-lg">Learn in 5-10 minutes daily!</p>
          
          <input
            type="text"
            placeholder="Your name..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-5 py-3 mb-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg transition"
          />
          
          <button
            onClick={() => {
              if (userName.trim()) {
                setShowNameInput(false);
                setCurrentPhase(0);
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-lg"
          >
            Start Learning →
          </button>
        </div>
      </div>
    );
  }

  // Фаза 0: Главное меню
  if (currentPhase === 0 && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up { animation: slide-up 0.6s ease-out; }
        `}</style>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="title text-4xl font-bold text-gray-800">👋 Hello, {userName}!</h1>
            <p className="text-gray-600 mt-2 text-lg">Ready for today's drill?</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up">
            <div className="bg-green-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.correctAnswers}</div>
              <div className="text-xs text-green-600">Correct</div>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.wordsLearned.length}</div>
              <div className="text-xs text-blue-600">Words</div>
            </div>
            <div className="bg-orange-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{stats.completedThemes.length}</div>
              <div className="text-xs text-orange-600">Themes</div>
            </div>
          </div>

          {/* Themes */}
          <div className="space-y-3 mb-8">
            {themes.map((theme, idx) => (
              <button
                key={theme.id}
                onClick={() => startNewSession()}
                className="w-full bg-white rounded-2xl p-5 text-left hover:shadow-md transition transform hover:scale-102 border-2 border-gray-100 hover:border-blue-300 animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{theme.emoji}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{theme.name}</h3>
                      <p className="text-xs text-gray-500">{theme.topics.length} topics</p>
                    </div>
                  </div>
                  <ChevronRight className="text-blue-500" size={24} />
                </div>
              </button>
            ))}
          </div>

          {/* Random button */}
          <button
            onClick={() => startNewSession()}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-2xl text-lg hover:shadow-lg transition transform hover:scale-105 mb-4"
          >
            🎲 Random Quick Drill
          </button>

          <button
            onClick={resetApp}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
          >
            Change Name
          </button>
        </div>
      </div>
    );
  }

  // Фаза 1: Разминка
  if (currentPhase === 1 && session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
          @keyframes pulse-glow { 
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .pulse { animation: pulse-glow 2s ease-in-out infinite; }
        `}</style>

        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center animate-slide-up">
          <div className="text-6xl mb-6 pulse">👋</div>
          <h2 className="title text-3xl font-bold text-gray-800 mb-4">{session.phase1_warmup.greeting}</h2>
          <p className="text-xl text-blue-600 font-semibold mb-6">{session.phase1_warmup.topic}</p>
          <p className="text-lg text-gray-700 mb-8">{session.phase1_warmup.question}</p>
          
          <button
            onClick={() => setCurrentPhase(2)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-lg"
          >
            Let's go! →
          </button>
        </div>
      </div>
    );
  }

  // Фаза 2: Новое содержание
  if (currentPhase === 2 && session) {
    const content = session.phase2_content;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
        `}</style>

        <div className="max-w-2xl mx-auto mb-4">
          <div className="text-center mb-8">
            <h2 className="title text-3xl font-bold text-gray-800 mb-2">📚 Today's Lesson</h2>
            <p className="text-gray-600 capitalize text-lg">{content.type.replace(/_/g, ' ')}</p>
          </div>

          {/* Vocabulary & Phrases */}
          {content.vocabulary_phrases && (
            <div className="space-y-4">
              {content.vocabulary_phrases.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="title text-2xl font-bold text-blue-600">{item.word}</h3>
                      <p className="text-sm text-gray-500 italic">{item.phonetic}</p>
                    </div>
                    <span className="text-3xl">📝</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-4">= {item.translation}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-bold text-blue-800 mb-3">💬 Common Phrases:</p>
                    {item.collocations && item.collocations.map((coll, i) => (
                      <div key={i} className="mb-3 p-2 bg-white rounded">
                        <p className="font-semibold text-gray-800">"{coll.phrase}"</p>
                        <p className="text-xs text-gray-600 mb-1">Meaning: {coll.meaning}</p>
                        <p className="text-sm text-gray-700 italic">Example: {coll.example}</p>
                      </div>
                    ))}
                  </div>

                  {item.distinction && (
                    <div className="bg-amber-50 rounded-lg p-3 mb-3 border-l-2 border-amber-400">
                      <p className="text-xs font-bold text-amber-900">⚠️ Distinction:</p>
                      <p className="text-sm text-amber-800">{item.distinction}</p>
                    </div>
                  )}

                  {item.casual_vs_formal && (
                    <div className="bg-green-50 rounded-lg p-3 border-l-2 border-green-400">
                      <p className="text-xs font-bold text-green-900">🗣️ Casual vs Formal:</p>
                      <p className="text-sm text-green-800">{item.casual_vs_formal}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sentence Patterns */}
          {content.sentence_patterns && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500 space-y-4">
              <div>
                <h3 className="title text-2xl font-bold text-purple-600 mb-2">📖 Sentence Pattern</h3>
                <div className="bg-purple-100 rounded-lg p-4 mb-4">
                  <p className="text-lg font-bold text-purple-900 text-center">{content.sentence_patterns.pattern}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-blue-900 mb-2">🎯 Different Uses:</p>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Statement:</strong> {content.sentence_patterns.uses.statement}</p>
                  <p><strong>Question:</strong> {content.sentence_patterns.uses.question}</p>
                  <p><strong>Negative:</strong> {content.sentence_patterns.uses.negative}</p>
                  <p><strong>Emphasis:</strong> {content.sentence_patterns.uses.emphasis}</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-bold text-green-900 mb-2">📍 Real-Life Situations:</p>
                {content.sentence_patterns.real_situations && content.sentence_patterns.real_situations.map((sit, i) => (
                  <p key={i} className="text-sm text-green-800 mb-1">• {sit}</p>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-bold text-gray-900 mb-2">📝 Examples:</p>
                {content.sentence_patterns.examples && content.sentence_patterns.examples.map((ex, i) => (
                  <p key={i} className="text-sm text-gray-800 mb-2 p-2 bg-white rounded">{ex}</p>
                ))}
              </div>
            </div>
          )}

          {/* Dialogue */}
          {content.dialogue && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
              <h3 className="title text-2xl font-bold text-purple-600 mb-2">🎭 Scene</h3>
              <p className="text-gray-600 mb-6">{content.dialogue.context}</p>
              
              <div className="space-y-4 mb-6">
                {content.dialogue.exchanges.map((ex, i) => (
                  <div key={i} className={`p-4 rounded-xl ${ex.speaker === 'A' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>
                    <p className="font-bold mb-2">Speaker {ex.speaker}:</p>
                    <p className="text-lg mb-2 font-semibold">{ex.text}</p>
                    <p className="text-sm italic opacity-75">{ex.translation}</p>
                  </div>
                ))}
              </div>

              {content.dialogue.key_phrases && (
                <div className="bg-amber-50 rounded-lg p-4 border-l-2 border-amber-400">
                  <p className="text-sm font-bold text-amber-900 mb-3">🔑 Key Phrases:</p>
                  <div className="space-y-2">
                    {content.dialogue.key_phrases.map((kp, i) => (
                      <div key={i} className="text-sm text-amber-800 p-2 bg-white rounded">
                        <p className="font-semibold">"{kp.phrase}"</p>
                        <p className="text-xs text-gray-600">When: {kp.meaning}</p>
                        {kp.alternative && <p className="text-xs text-gray-600">Similar: {kp.alternative}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setCurrentPhase(3)}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-lg"
          >
            Ready for exercises! →
          </button>
        </div>
      </div>
    );
  }

  // Фаза 3: Упражнения
  if (currentPhase === 3 && session) {
    const exercise = session.phase3_exercises[currentExerciseIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
        `}</style>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-semibold">Exercise {currentExerciseIndex + 1}/{session.phase3_exercises.length}</span>
              <span className="text-sm text-gray-500">{Math.round(((currentExerciseIndex + 1) / session.phase3_exercises.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
                style={{ width: `${((currentExerciseIndex + 1) / session.phase3_exercises.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Exercise */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <div className="text-5xl mb-4">
              {exercise.type === 'phrase_matching' && '💬'}
              {exercise.type === 'sentence_builder' && '✏️'}
              {exercise.type === 'collocation_fill' && '🎯'}
              {exercise.type === 'transform_sentence' && '🔄'}
              {exercise.type === 'situation_response' && '💭'}
            </div>
            
            <p className="text-gray-600 text-sm font-semibold mb-6 uppercase tracking-wide">{exercise.instruction}</p>

            {/* Phrase Matching */}
            {exercise.type === 'phrase_matching' && (
              <>
                <p className="text-2xl text-gray-800 mb-6 font-medium">"{exercise.phrase}"</p>
                <div className="space-y-3">
                  {exercise.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => !showFeedback && (setUserAnswer(opt), setTimeout(() => checkAnswer(opt), 100))}
                      className={`w-full p-4 text-left rounded-xl font-medium transition transform hover:scale-102 ${
                        userAnswer === opt
                          ? 'bg-blue-500 text-white border-2 border-blue-600'
                          : 'bg-gray-100 text-gray-800 border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Sentence Builder */}
            {exercise.type === 'sentence_builder' && (
              <>
                <p className="text-xl text-blue-600 mb-4 font-semibold bg-blue-50 p-4 rounded-lg">{exercise.pattern}</p>
                <input
                  type="text"
                  placeholder="Write your own example using this pattern..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer(userAnswer)}
                  className="w-full px-5 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 text-lg mb-4"
                  autoFocus
                />
                <p className="text-xs text-gray-600 mb-4 italic">💡 Hint: Your sentence should have a subject, verb, and a reason (because...)</p>
              </>
            )}

            {/* Collocation Fill */}
            {exercise.type === 'collocation_fill' && (
              <>
                <p className="text-2xl text-gray-800 mb-6 font-medium">{exercise.sentence}</p>
                <input
                  type="text"
                  placeholder="Type the word..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer(userAnswer)}
                  className="w-full px-5 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 text-lg mb-4"
                  autoFocus
                />
              </>
            )}

            {/* Transform Sentence */}
            {exercise.type === 'transform_sentence' && (
              <>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Original:</p>
                  <p className="text-lg font-semibold text-gray-800">"{exercise.original}"</p>
                </div>
                {exercise.hint && (
                  <p className="text-sm text-blue-600 mb-4 p-3 bg-blue-50 rounded-lg">💡 Hint: {exercise.hint}</p>
                )}
                <input
                  type="text"
                  placeholder="Rewrite using the hint..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer(userAnswer)}
                  className="w-full px-5 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 text-lg mb-4"
                  autoFocus
                />
              </>
            )}

            {/* Situation Response */}
            {exercise.type === 'situation_response' && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                  <p className="text-sm text-blue-700 mb-2">Situation:</p>
                  <p className="text-lg font-semibold text-blue-900">"{exercise.situation}"</p>
                </div>
                <input
                  type="text"
                  placeholder="What would you say? (use new phrases)..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer(userAnswer)}
                  className="w-full px-5 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-600 text-lg mb-4"
                  autoFocus
                />
                <p className="text-xs text-gray-600 italic">💡 Acceptable variations: {exercise.acceptable_answers.join(', ')}</p>
              </>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className={`mt-6 p-6 rounded-xl ${exerciseFeedback.isCorrect ? 'bg-green-100' : 'bg-orange-100'}`}>
                <p className="text-2xl mb-2">{exerciseFeedback.isCorrect ? '✅ Excellent!' : '❌ Close, but...'}</p>
                {!exerciseFeedback.isCorrect && exerciseFeedback.correctAnswer && (
                  <p className="text-lg font-semibold text-gray-800 mb-3">Better: {exerciseFeedback.correctAnswer}</p>
                )}
                <p className="text-gray-700">{exerciseFeedback.explanation}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!showFeedback && (
            <button
              onClick={() => checkAnswer(userAnswer)}
              disabled={!userAnswer}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Check Answer ✓
            </button>
          )}

          {showFeedback && (
            <button
              onClick={nextExercise}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition text-lg"
            >
              {currentExerciseIndex === session.phase3_exercises.length - 1 ? 'Finish! 🎉' : 'Next Exercise →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Фаза 4: Закрепление и результаты
  if (currentPhase === 4 && session) {
    const percentage = Math.round((stats.correctAnswers / Math.max(stats.totalAnswers, 1)) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap');
          * { font-family: 'Poppins', sans-serif; }
          .title { font-family: 'Fredoka', sans-serif; }
          @keyframes celebrate {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          .celebrate { animation: celebrate 0.6s ease-in-out; }
        `}</style>

        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-6 celebrate">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="title text-3xl font-bold text-gray-800 mb-2">Excellent!</h1>
            <p className="text-gray-600 mb-8 text-lg">Session completed!</p>

            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-bold text-blue-600">{percentage}%</div>
              <p className="text-gray-700 mt-2">Accuracy</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-100 rounded-xl p-3">
                <div className="text-2xl font-bold text-blue-700">{stats.correctAnswers}</div>
                <div className="text-xs text-blue-600">correct answers</div>
              </div>
              <div className="bg-green-100 rounded-xl p-3">
                <div className="text-2xl font-bold text-green-700">{session.phase2_content.vocabulary_phrases?.length || (session.phase2_content.sentence_patterns ? 1 : 1)}</div>
                <div className="text-xs text-green-600">patterns learned</div>
              </div>
            </div>

            {/* Key Phrases */}
            {session.phase4_summary.key_phrases && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-semibold text-amber-900 mb-2">🔑 Key Phrases:</p>
                <div className="text-xs text-amber-800 space-y-1">
                  {session.phase4_summary.key_phrases.map((phrase, i) => (
                    <p key={i}>• "{phrase}"</p>
                  ))}
                </div>
              </div>
            )}

            {/* Sentence Pattern */}
            {session.phase4_summary.sentence_pattern_learned && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-semibold text-purple-900 mb-2">📝 Pattern:</p>
                <p className="text-xs text-purple-800">{session.phase4_summary.sentence_pattern_learned}</p>
              </div>
            )}

            {/* Collocation Tips */}
            {session.phase4_summary.collocation_tips && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-semibold text-green-900 mb-2">💡 Remember:</p>
                <p className="text-xs text-green-800">{session.phase4_summary.collocation_tips}</p>
              </div>
            )}

            <p className="text-lg font-semibold text-gray-800 mb-8">{session.phase4_summary.motivation}</p>

            <button
              onClick={() => setCurrentPhase(0)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition transform hover:scale-105 text-lg mb-3"
            >
              Next Drill →
            </button>

            <button
              onClick={resetApp}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-2xl text-gray-700 font-semibold">Loading your drill...</p>
      </div>
    </div>
  );
};

export default EnglishQuickDrill;
