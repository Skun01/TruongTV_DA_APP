import { useState } from 'react'
import { ClockIcon, LightbulbIcon, BookOpenIcon } from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import type { ConversationResultResponse } from '@/types/conversation'
import { Button } from '@/components/ui/button'

interface ConversationResultProps {
  result: ConversationResultResponse
  onClose?: () => void
}

export function ConversationResult({ result, onClose }: ConversationResultProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vocab' | 'grammar'>('overview')

  return (
    <div className="space-y-6 rounded-2xl border border-border/50 bg-surface-container-low p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">
          {CONVERSATION_COPY.resultTitle}
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            {CONVERSATION_COPY.backToList}
          </Button>
        )}
      </div>

      {/* Score */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-border"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(result.score / 100) * 351.86} 351.86`}
                strokeLinecap="round"
                className={result.score >= 70 ? 'text-emerald-500' : result.score >= 40 ? 'text-amber-500' : 'text-red-500'}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{result.score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {result.feedback}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center rounded-xl bg-surface p-4">
          <span className="text-2xl font-bold text-primary">{result.totalMessages}</span>
          <span className="text-xs text-muted-foreground">
            <BookOpenIcon size={14} className="mr-1 inline" />
            {CONVERSATION_COPY.totalMessages}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-surface p-4">
          <span className="text-2xl font-bold text-primary">{result.duration}</span>
          <span className="text-xs text-muted-foreground">
            <ClockIcon size={14} className="mr-1 inline" />
            {CONVERSATION_COPY.duration}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl bg-surface p-4">
          <span className="text-2xl font-bold text-amber-500">{result.newVocabulary.length}</span>
          <span className="text-xs text-muted-foreground">
            <LightbulbIcon size={14} className="mr-1 inline" />
            {CONVERSATION_COPY.newWordsLearned}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {CONVERSATION_COPY.feedback}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vocab')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'vocab'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {CONVERSATION_COPY.newWordsLearned} ({result.newVocabulary.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grammar')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'grammar'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {CONVERSATION_COPY.grammarPointsLearned} ({result.grammarPoints.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="rounded-xl bg-surface p-4">
            <p className="whitespace-pre-wrap text-sm text-foreground">{result.feedback}</p>
          </div>
        )}

        {activeTab === 'vocab' && (
          <div className="space-y-3">
            {result.newVocabulary.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Không có từ mới nào được học trong cuộc hội thoại này.
              </p>
            ) : (
              result.newVocabulary.map((vocab, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {vocab.word}
                    </span>
                    <span className="text-sm text-muted-foreground">({vocab.reading})</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{vocab.meaning}</p>
                  {vocab.example && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      Ví dụ: {vocab.example}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="space-y-3">
            {result.grammarPoints.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Không có cấu trúc ngữ pháp mới nào được học.
              </p>
            ) : (
              result.grammarPoints.map((grammar, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"
                >
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {grammar}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
