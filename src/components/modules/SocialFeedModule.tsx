'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { SocialPost } from '@/types/hr';
import {
  MessageSquare,
  Heart,
  Send,
  Plus,
  Sparkles,
  Share2,
  TrendingUp,
  Award,
  Vote,
  Calendar,
  Smile,
  X,
  Users,
} from 'lucide-react';

export function SocialFeedModule() {
  const { socialPosts, likePost, addPostComment, createPost, votePoll, currentUser, employees } =
    useHR();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postType, setPostType] = useState<'announcement' | 'kudos' | 'celebration' | 'poll'>(
    'announcement'
  );
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');

  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) || employees[3] || employees[0];

  const handleCommentSubmit = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    addPostComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    createPost({
      authorName: `${currentEmp.firstName} ${currentEmp.lastName}`,
      authorRole: currentEmp.position,
      avatarColor: currentEmp.avatarColor,
      department: currentEmp.department,
      type: postType,
      title: postTitle.trim() || undefined,
      content: postContent.trim(),
      pollOptions:
        postType === 'poll'
          ? [
              { label: 'ვარიანტი #1', votes: 1 },
              { label: 'ვარიანტი #2', votes: 0 },
            ]
          : undefined,
    });

    setShowNewPostModal(false);
    setPostTitle('');
    setPostContent('');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Feed Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>HR NEXA • Corporate Social Wall</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            შიდა კორპორატიული სიახლეები და კედელი
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            გაუზიარეთ სიახლეები თანაგუნდელებს, მიულოცეთ მიღწევები, გადაეცით Kudos და მიიღეთ
            მონაწილეობა გამოკითხვებში!
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/25 transition transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ ახალი პოსტი / სიახლე</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: The Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Quick Share Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl ${currentEmp.avatarColor} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
              >
                {currentEmp.firstName[0]}
                {currentEmp.lastName[0]}
              </div>
              <input
                type="text"
                placeholder={`რა არის ახალი, ${currentEmp.firstName}? გაუზიარე გუნდს...`}
                onClick={() => setShowNewPostModal(true)}
                readOnly
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => {
                  setPostType('kudos');
                  setShowNewPostModal(true);
                }}
                className="flex items-center gap-1.5 hover:text-amber-600 transition cursor-pointer font-bold"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>⭐ Kudos გადაცემა</span>
              </button>
              <button
                onClick={() => {
                  setPostType('poll');
                  setShowNewPostModal(true);
                }}
                className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer font-bold"
              >
                <Vote className="w-4 h-4 text-indigo-500" />
                <span>📊 გამოკითხვა</span>
              </button>
              <button
                onClick={() => {
                  setPostType('celebration');
                  setShowNewPostModal(true);
                }}
                className="flex items-center gap-1.5 hover:text-rose-600 transition cursor-pointer font-bold"
              >
                <Smile className="w-4 h-4 text-rose-500" />
                <span>🎉 მილოცვა</span>
              </button>
            </div>
          </div>

          {/* Posts List */}
          {socialPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4"
            >
              {/* Post Author Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl ${post.avatarColor} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {post.authorName[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{post.authorName}</h3>
                    <p className="text-[11px] text-slate-500">
                      {post.authorRole} • {post.department}
                    </p>
                    <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                    post.type === 'kudos'
                      ? 'bg-amber-100 text-amber-800'
                      : post.type === 'poll'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {post.type === 'kudos'
                    ? '⭐ Kudos'
                    : post.type === 'poll'
                    ? '📊 გამოკითხვა'
                    : '📢 სიახლე'}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                {post.title && (
                  <h4 className="font-black text-base text-slate-900">{post.title}</h4>
                )}
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Poll Options (If applicable) */}
              {post.pollOptions && (
                <div className="space-y-2 pt-1">
                  {post.pollOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => votePoll(post.id, oIdx)}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 text-left transition flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-indigo-900">
                        {opt.label}
                      </span>
                      <span className="font-mono font-black text-indigo-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                        {opt.votes} ხმა
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Like Counter & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition cursor-pointer px-3 py-1.5 rounded-xl ${
                    post.hasLiked
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-600' : ''}`} />
                  <span>{post.likes} მოწონება</span>
                </button>

                <div className="text-slate-400 text-xs font-semibold">
                  {post.comments.length} კომენტარი
                </div>
              </div>

              {/* Comments Thread */}
              {post.comments.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-slate-50">
                  {post.comments.map((com) => (
                    <div key={com.id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-slate-900">{com.authorName}</span>
                        <span className="text-slate-400">{com.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700">{com.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="დაწერეთ კომენტარი..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCommentSubmit(post.id);
                  }}
                  className="flex-1 px-4 py-2 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right 4 Cols: Company News, Kudos Leaderboard & Birthdays */}
        <div className="lg:col-span-4 space-y-5">
          {/* NEXA Kudos Highlights */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h4 className="font-extrabold text-sm text-slate-900">თვის ვარსკვლავები (Kudos)</h4>
            </div>

            <div className="space-y-3">
              {[
                { name: 'თამარ გელაშვილი', role: 'IT Dev', points: 650, medal: '🥇' },
                { name: 'გიორგი ბერიძე', role: 'CTO', points: 580, medal: '🥈' },
                { name: 'ნიკოლოზ კვარაცხელია', role: 'DevOps', points: 510, medal: '🥉' },
              ].map((leader, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{leader.medal}</span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{leader.name}</div>
                      <div className="text-[10px] text-slate-500">{leader.role}</div>
                    </div>
                  </div>
                  <span className="font-black text-xs text-amber-600">{leader.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Birthdays & Anniversaries */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h4 className="font-extrabold text-sm text-slate-900">
                დაბადების დღეები & იუბილეები
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">გიორგი ბერიძე</div>
                  <div className="text-[11px] text-indigo-700">08 ნოემბერი (3 დღეში)</div>
                </div>
                <span className="text-base">🎂</span>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">ნინო კაპანაძე</div>
                  <div className="text-[11px] text-emerald-700">14 ნოემბერი (6 წელი კომპანიაში)</div>
                </div>
                <span className="text-base">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">ახალი პოსტის შექმნა კორპორატიულ კედელზე</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">პოსტის ტიპი:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'announcement', label: '📢 სიახლე' },
                    { id: 'kudos', label: '⭐ Kudos' },
                    { id: 'celebration', label: '🎉 მილოცვა' },
                    { id: 'poll', label: '📊 გამოკითხვა' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPostType(t.id as typeof postType)}
                      className={`py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        postType === t.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">სათაური (არასავალდებულო):</label>
                <input
                  type="text"
                  placeholder="მაგ: ახალი წარმატება გუნდში!"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ტექსტი / აღწერა:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="დაწერეთ თქვენი შეტყობინება..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-md shadow-indigo-600/20 cursor-pointer transition transform active:scale-95"
                >
                  გამოქვეყნება
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
