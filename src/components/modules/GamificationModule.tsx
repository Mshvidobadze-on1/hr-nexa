'use client';

import React, { useState } from 'react';
import { useHR } from '@/context/HRContext';
import { RewardItem } from '@/types/hr';
import {
  Award,
  Sparkles,
  ShoppingBag,
  Palmtree,
  Coffee,
  Shirt,
  Dumbbell,
  Gift,
  CheckCircle2,
  TrendingUp,
  Flame,
  Star,
  Users,
} from 'lucide-react';

export function GamificationModule() {
  const { rewards, redeemReward, currentUser, employees } = useHR();
  const currentEmp =
    employees.find((e) => e.id === currentUser?.employeeId) || employees[3] || employees[0];

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palmtree':
        return <Palmtree className="w-6 h-6 text-emerald-600" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-amber-600" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-indigo-600" />;
      case 'Dumbbell':
        return <Dumbbell className="w-6 h-6 text-cyan-600" />;
      default:
        return <Gift className="w-6 h-6 text-pink-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Points Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 lg:p-7 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-indigo-900/40">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>NEXA Gamification & Employee Recognition</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black">
            გემიფიკაცია და საჩუქრების მაღაზია
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            დააგროვეთ ქულები ტრენინგების გავლით, დროული დასწრებითა და კოლეგებისგან მიღებული Kudos-ით.
            გადაცვალეთ ქულები რეალურ საჩუქრებსა და დამატებით დასვენების დღეებში!
          </p>
        </div>

        {/* Big Points Badge */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[200px] shadow-lg">
          <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
            ჩემი ხელმისაწვდომი ბალანსი
          </div>
          <div className="text-4xl font-black text-amber-400 mt-1 flex items-center justify-center gap-2">
            <span>{currentEmp.nexaPoints}</span>
            <span className="text-lg text-amber-300 font-bold">pts</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            დონე: <strong className="text-white">Gold Member (Level 3)</strong>
          </div>
        </div>
      </div>

      {/* Rules Engine Explained */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            NEXA Rules Engine — როგორ დავაგროვოთ ქულები:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              +75
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">LMS ტრენინგის გავლა</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                კურსისა და შემაჯამებელი ქვიზის 70%+-ით ჩაბარება
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              +50
            </div>
            <div>
              <div className="font-bold text-slate-900">დროული დასწრების სტრიქი</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                1 სრული კვირა ტურნაკეტზე დროულად დაფიქსირება
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              +50
            </div>
            <div>
              <div className="font-bold text-slate-900">Peer Kudos კოლეგისგან</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                თანაგუნდელის მიერ მადლობისა და დაფასების გამოხატვა
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs shrink-0">
              +100
            </div>
            <div>
              <div className="font-bold text-slate-900">კვარტალური KPI შეფასება</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Performance Evaluation-ში 90%+-იანი შედეგი
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEXA Rewards Shop */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-lg text-slate-900">
              NEXA Rewards Shop (საჩუქრების მაღაზია)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            აირჩიეთ სასურველი საჩუქარი და გამოისყიდეთ 1 კლიკით
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rewards.map((reward) => {
            const canAfford = currentEmp.nexaPoints >= reward.costPoints;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                      {getRewardIcon(reward.icon)}
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {reward.category}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 mt-3">{reward.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {reward.description}
                  </p>

                  <div className="text-[11px] text-slate-400 mt-2">
                    ნაშთი: <strong>{reward.availableStock} ცალი</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="font-black text-base text-amber-600">
                    {reward.costPoints} <span className="text-xs font-semibold">pts</span>
                  </div>

                  <button
                    onClick={() => redeemReward(reward.id)}
                    disabled={!canAfford || reward.availableStock <= 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition transform active:scale-95 cursor-pointer ${
                      canAfford && reward.availableStock > 0
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'გამოსყიდვა 🎁' : 'არასაკმარისი ქულა'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
