/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Leaf, 
  TrendingDown, 
  Award, 
  CheckCircle2, 
  TreeDeciduous, 
  Zap, 
  Bus, 
  Recycle, 
  User,
  ChevronRight,
  Heart,
  Trophy,
  Star,
  Calendar,
  Flame,
  Lock,
  Clock,
  X,
  Droplets,
  FileText,
  Ban,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Hand,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Action {
  id: string;
  name: string;
  points: number;
  icon: React.ReactNode;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  color: string;
}

// --- Constants ---
const QUICK_ACTIONS: Action[] = [
  { id: 'transport', name: '绿色出行', points: 15, icon: <Bus className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
  { id: 'energy', name: '节约用电', points: 10, icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'waste', name: '垃圾分类', points: 5, icon: <Recycle className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
  { id: 'diet', name: '素食一餐', points: 12, icon: <Leaf className="w-5 h-5" />, color: 'bg-emerald-100 text-emerald-600' },
];

const ALL_ACTIONS: Action[] = [
  ...QUICK_ACTIONS,
  { id: 'water', name: '节约用水', points: 8, icon: <Droplets className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600' },
  { id: 'paper', name: '无纸化办公', points: 10, icon: <FileText className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'plastic', name: '拒绝塑料袋', points: 15, icon: <Ban className="w-5 h-5" />, color: 'bg-rose-100 text-rose-600' },
  { id: 'shopping', name: '自带购物袋', points: 12, icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
  { id: 'planting', name: '云端植树', points: 20, icon: <TreeDeciduous className="w-5 h-5" />, color: 'bg-lime-100 text-lime-600' },
];

const TIPS = [
  "随手关灯，不仅能节约电能，还能减少发电过程中的碳排放。每节约一度电，相当于减少约 0.997kg 的二氧化碳排放。",
  "减少肉类消费，尤其是牛肉。生产 1kg 牛肉产生的温室气体相当于驾驶汽车行驶 100 公里的排放量。",
  "使用公共交通、骑行或步行代替私家车出行。每减少 1 升汽油消耗，可减少约 2.3kg 的二氧化碳排放。",
  "拒绝一次性塑料制品。塑料的降解需要数百年，且生产过程消耗大量化石能源。",
  "洗澡时间缩短 1 分钟，每年可节约近 10 吨水，并减少加热水所需的能源消耗。",
  "将空调温度调高 1 摄氏度，可节电约 10%，同时让身体更适应自然温度。",
  "购买本地生产的季节性食材，减少食品在运输过程中的‘食物里程’和碳足迹。"
];

export default function App() {
  const [dailyPoints, setDailyPoints] = useState(42);
  const [totalReduction, setTotalReduction] = useState(128.5);
  const [petLevel, setPetLevel] = useState(3);
  const [petExp, setPetExp] = useState(65); // Percentage
  const [checkedActions, setCheckedActions] = useState<string[]>([]);
  const [daysTracked, setDaysTracked] = useState(12);
  const [history, setHistory] = useState<{ id: string; name: string; time: string; points: number; icon: React.ReactNode }[]>([]);
  const [toast, setToast] = useState<{ message: string; points: number } | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const achievements: Achievement[] = [
    {
      id: 'first_step',
      title: '初露锋芒',
      description: '完成首次绿色打卡',
      icon: <Star className="w-5 h-5" />,
      targetValue: 1,
      currentValue: checkedActions.length > 0 ? 1 : 0,
      isUnlocked: checkedActions.length > 0,
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      id: 'point_master',
      title: '绿意达人',
      description: '当日积分达到 100 分',
      icon: <Trophy className="w-5 h-5" />,
      targetValue: 100,
      currentValue: dailyPoints,
      isUnlocked: dailyPoints >= 100,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 'reduction_pioneer',
      title: '减排先锋',
      description: '累计减排达到 200 kg',
      icon: <Flame className="w-5 h-5" />,
      targetValue: 200,
      currentValue: totalReduction,
      isUnlocked: totalReduction >= 200,
      color: 'text-orange-500 bg-orange-50'
    },
    {
      id: 'century_streak',
      title: '百日坚持',
      description: '坚持绿色生活 100 天',
      icon: <Calendar className="w-5 h-5" />,
      targetValue: 100,
      currentValue: daysTracked,
      isUnlocked: daysTracked >= 100,
      color: 'text-blue-500 bg-blue-50'
    }
  ];

  const handleCheckIn = (action: Action) => {
    if (checkedActions.includes(action.id)) {
      // Cancellation Logic
      setDailyPoints(prev => Math.max(0, prev - action.points));
      setTotalReduction(prev => Math.max(0, prev - (action.points * 0.05)));
      setPetExp(prev => {
        let newExp = prev - 15;
        if (newExp < 0) {
          if (petLevel > 1) {
            setPetLevel(l => l - 1);
            return 100 + newExp;
          }
          return 0;
        }
        return newExp;
      });
      setCheckedActions(prev => prev.filter(id => id !== action.id));
      setHistory(prev => prev.filter(item => !(item.name === action.name && item.points === action.points)));
      setToast({ message: `已取消：${action.name}`, points: -action.points });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    // Update Stats
    setDailyPoints(prev => prev + action.points);
    setTotalReduction(prev => prev + (action.points * 0.05));
    
    // Update Pet
    setPetExp(prev => {
      const newExp = prev + 15; // Increased exp gain for better feel
      if (newExp >= 100) {
        setPetLevel(l => l + 1);
        return newExp - 100;
      }
      return newExp;
    });

    // Add to History
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setHistory(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      name: action.name,
      time: timeStr,
      points: action.points,
      icon: action.icon
    }, ...prev]);

    // Track checked actions for the day
    setCheckedActions(prev => [...prev, action.id]);

    // Show Toast
    setToast({ message: `打卡成功：${action.name}`, points: action.points });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePetInteraction = (type: 'feed' | 'water' | 'play' | 'pet' | 'sing') => {
    if (interactionCount >= 5) {
      setToast({ message: '碳宝今天累了，明天再来互动吧！', points: 0 });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    const config = {
      feed: { msg: '喂食成功！碳宝长得更壮了', exp: 5 },
      water: { msg: '浇水成功！碳宝变得更绿了', exp: 3 },
      play: { msg: '玩耍成功！碳宝心情大好', exp: 4 },
      pet: { msg: '抚摸成功！碳宝感到很安心', exp: 2 },
      sing: { msg: '唱歌成功！碳宝跟着节奏摇摆', exp: 6 }
    };

    setPetExp(prev => {
      const newExp = prev + config[type].exp;
      if (newExp >= 100) {
        setPetLevel(l => l + 1);
        return newExp - 100;
      }
      return newExp;
    });

    setInteractionCount(prev => prev + 1);
    setToast({ message: config[type].msg, points: 0 });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-900">绿意知行</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 font-medium">欢迎回来</p>
              <p className="text-sm font-semibold">林小绿</p>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
              <User className="text-slate-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800">今日碳足迹概览</h2>
          <p className="text-slate-500">坚持绿色生活，让地球更美好。</p>
        </section>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Points Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                <Award className="text-emerald-600 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                +12% 较昨日
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">当日碳积分</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-slate-900">{dailyPoints}</span>
              <span className="text-slate-400 font-medium">分</span>
            </div>
          </motion.div>

          {/* Total Reduction Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                <TrendingDown className="text-blue-600 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                累计贡献
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">总减排量 (CO2e)</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-slate-900">{totalReduction.toFixed(1)}</span>
              <span className="text-slate-400 font-medium">kg</span>
            </div>
          </motion.div>
        </div>

        {/* Pet & Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Virtual Pet Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-200"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col gap-8 w-full">
              {/* Top Half: Pet Visual & Info */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Pet Visual */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <TreeDeciduous className="w-20 h-20 md:w-24 md:h-24 text-white drop-shadow-lg" />
                    </motion.div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    LV.{petLevel}
                  </div>
                </div>
  
                {/* Pet Info */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      碳宝 <span className="text-emerald-100 text-sm font-normal opacity-80">(成长中)</span>
                    </h3>
                    <p className="text-emerald-50 text-sm mt-1">碳宝今天感觉很有活力！多打卡能让它长得更快哦。</p>
                  </div>
  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>成长进度</span>
                      <span>{petExp}%</span>
                    </div>
                    <div className="h-3 bg-emerald-900/20 rounded-full overflow-hidden border border-white/20">
                      <motion.div 
                        className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${petExp}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                      />
                    </div>
                  </div>
  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>亲密度 99+</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <Zap className="w-3.5 h-3.5" />
                      <span>活力值 85%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Half: Interaction Buttons */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">互动投喂</p>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-100/80">
                    <span>今日互动次数</span>
                    <span className="font-bold px-2 py-0.5 bg-white/20 rounded-full">{interactionCount}/5</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <button 
                    onClick={() => handlePetInteraction('feed')}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/20 transition-colors group"
                    title="施肥"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">施肥</span>
                  </button>
                  <button 
                    onClick={() => handlePetInteraction('water')}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/20 transition-colors group"
                    title="浇水"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Droplets className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">浇水</span>
                  </button>
                  <button 
                    onClick={() => handlePetInteraction('play')}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/20 transition-colors group"
                    title="玩耍"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">玩耍</span>
                  </button>
                  <button 
                    onClick={() => handlePetInteraction('pet')}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/20 transition-colors group"
                    title="抚摸"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Hand className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">抚摸</span>
                  </button>
                  <button 
                    onClick={() => handlePetInteraction('sing')}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/20 transition-colors group"
                    title="唱歌"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-bold">唱歌</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">快速打卡</h3>
              <button 
                onClick={() => setShowMoreActions(true)}
                className="text-xs text-emerald-600 font-bold hover:underline flex items-center"
              >
                更多 <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {QUICK_ACTIONS.map((action) => {
                const isChecked = checkedActions.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => handleCheckIn(action)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                      isChecked 
                        ? 'bg-emerald-50 border-emerald-100 shadow-inner' 
                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isChecked ? 'bg-emerald-500 text-white' : action.color}`}>
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-bold ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>{action.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {isChecked ? '点击取消打卡' : `+${action.points} 积分`}
                        </p>
                      </div>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50">
              <p className="text-[10px] text-center text-slate-400 leading-relaxed">
                每次打卡都为地球减少了一份负担
              </p>
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              成就勋章
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              已解锁 {achievements.filter(a => a.isUnlocked).length} / {achievements.length}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-3xl border transition-all duration-300 ${
                  achievement.isUnlocked 
                    ? 'bg-white border-slate-100 shadow-sm' 
                    : 'bg-slate-50/50 border-slate-100 opacity-70 grayscale'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${achievement.isUnlocked ? achievement.color : 'bg-slate-100 text-slate-400'}`}>
                    {achievement.isUnlocked ? achievement.icon : <Lock className="w-5 h-5" />}
                  </div>
                  {achievement.isUnlocked && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </div>
                
                <h3 className={`font-bold text-sm mb-1 ${achievement.isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mb-4 leading-tight">
                  {achievement.description}
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>进度</span>
                    <span>{Math.min(Math.round((achievement.currentValue / achievement.targetValue) * 100), 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((achievement.currentValue / achievement.targetValue) * 100), 100}%` }}
                      className={`h-full ${achievement.isUnlocked ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* History/Tips Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                打卡记录
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                今日
              </span>
            </div>
            
            <div className="flex-1 space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {history.length > 0 ? (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-600">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.time}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-600">+{item.points}</span>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <TrendingDown className="text-slate-200 w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium text-slate-400">今天还没有打卡记录哦</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">环保小贴士</h3>
              <button 
                onClick={() => setTipIndex((prev) => (prev + 1) % TIPS.length)}
                className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-emerald-500"
                title="换一条"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden min-h-[120px] flex items-center">
              <Leaf className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-100/50 rotate-12" />
              <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-emerald-800 leading-relaxed italic"
                  >
                    “{TIPS[tipIndex]}”
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{toast.message}</p>
                <p className="text-[10px] text-emerald-400 font-medium">获得 +{toast.points} 碳积分</p>
              </div>
              <button onClick={() => setToast(null)} className="ml-2 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* More Actions Modal */}
      <AnimatePresence>
        {showMoreActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">全部环保行动</h3>
                    <p className="text-xs text-slate-400 font-medium">选择一项行动开始打卡</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMoreActions(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_ACTIONS.map((action) => {
                    const isChecked = checkedActions.includes(action.id);
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleCheckIn(action)}
                        className={`flex items-center gap-4 p-4 rounded-3xl border transition-all duration-200 ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-200 shadow-inner' 
                            : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md active:scale-[0.98]'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl ${isChecked ? 'bg-emerald-500 text-white' : action.color}`}>
                          {action.icon}
                        </div>
                        <div className="text-left flex-1">
                          <p className={`text-sm font-bold ${isChecked ? 'text-emerald-900' : 'text-slate-700'}`}>{action.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {isChecked ? '点击取消打卡' : `+${action.points} 积分`}
                          </p>
                        </div>
                        {isChecked && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium">
                  坚持打卡，解锁更多环保成就
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">© 2026 绿意知行 · 让环保成为一种生活方式</p>
      </footer>
    </div>
  );
}
