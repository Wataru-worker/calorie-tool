import React, { useMemo, useState } from 'react';

const activityOptions = [
  { value: 'sedentary', label: 'デスクワーク中心（ほとんど運動しない）', multiplier: 1.2 },
  { value: 'light', label: '軽い運動（週1〜2回）', multiplier: 1.375 },
  { value: 'moderate', label: '中強度の運動（週3〜5回）', multiplier: 1.55 },
  { value: 'high', label: '高強度の運動（週5〜6回）', multiplier: 1.725 },
  { value: 'very_high', label: 'アスリートレベル（1日2回）', multiplier: 1.9 },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function round(value) {
  return Math.round(value);
}

function estimateBodyFat({ sex, heightCm, neckCm, waistCm, hipCm }) {
  if (sex === 'male') {
    return (
      495 /
        (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) -
      450
    );
  }

  return (
    495 /
      (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) -
    450
  );
}

function getActivityMultiplier(activity) {
  return activityOptions.find((item) => item.value === activity)?.multiplier ?? 1.2;
}

function getBodyFatComment(bodyFat, sex) {
  if (sex === 'male') {
    if (bodyFat < 10) return 'かなり絞れている状態です。コンディション重視の数値です。';
    if (bodyFat < 15) return 'かなり引き締まっています。見た目もシャープに出やすい範囲です。';
    if (bodyFat < 20) return '標準〜やや引き締まった範囲です。扱いやすい体型です。';
    if (bodyFat < 25) return '少し体脂肪が乗りやすい範囲です。減量で見た目が変わりやすいです。';
    return '体脂肪はやや高めです。まずは無理のない減量が有力です。';
  }

  if (bodyFat < 18) return 'かなり絞れている状態です。';
  if (bodyFat < 24) return '引き締まった範囲です。';
  if (bodyFat < 31) return '標準的な範囲です。';
  if (bodyFat < 36) return 'やや高めの範囲です。';
  return '体脂肪は高めです。無理のない調整がおすすめです。';
}

function getBmiCategory(bmi) {
  if (bmi < 18.5) return '低体重';
  if (bmi < 25) return '普通体重';
  if (bmi < 30) return '肥満（1度）';
  return '肥満';
}

export default function App() {
  const [form, setForm] = useState({
    sex: 'male',
    age: '',
    heightCm: '',
    weightKg: '',
    bodyFatPct: '',
    neckCm: '',
    waistCm: '',
    hipCm: '',
    activity: 'sedentary',
  });

  const [submitted, setSubmitted] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumericChange = (key, value, maxLen) => {
    const onlyDigits = value.replace(/[^0-9]/g, '');
    const sliced = onlyDigits.slice(0, maxLen);
    setForm((prev) => ({ ...prev, [key]: sliced }));
  };

  const requiredFilled = useMemo(() => {
    const basic = form.age && form.heightCm && form.weightKg && form.activity;
    if (!basic) return false;
    return true;
  }, [form]);

  const result = useMemo(() => {
    if (!requiredFilled) return null;

    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);

    if ([age, heightCm, weightKg].some((v) => Number.isNaN(v) || v <= 0)) {
      return { error: '入力値を確認してください。' };
    }

    let bodyFat = null;
    let bodyFatSource = 'none';

    if (!showMeasure && form.bodyFatPct) {
      bodyFat = clamp(Number(form.bodyFatPct), 3, 60);
      bodyFatSource = 'input';
    } else if (showMeasure && form.neckCm && form.waistCm && (form.sex === 'male' || form.hipCm)) {
      const neckCm = Number(form.neckCm);
      const waistCm = Number(form.waistCm);
      const hipCm = Number(form.hipCm || 0);

      if (
        [neckCm, waistCm].some((v) => Number.isNaN(v) || v <= 0) ||
        (form.sex === 'female' && (Number.isNaN(hipCm) || hipCm <= 0))
      ) {
        return { error: '入力値を確認してください。' };
      }

      if (form.sex === 'male' && waistCm <= neckCm) {
        return { error: '男性は腹囲が首周りより大きい必要があります。' };
      }

      if (form.sex === 'female' && waistCm + hipCm <= neckCm) {
        return { error: '女性の計算条件を満たしていません。' };
      }

      const raw = estimateBodyFat({
        sex: form.sex,
        heightCm,
        neckCm,
        waistCm,
        hipCm,
      });

      if (!Number.isFinite(raw)) {
        return { error: '体脂肪率を計算できませんでした。' };
      }

      bodyFat = clamp(raw, 3, 60);
      bodyFatSource = 'navy';
    } else {
      const bmi = weightKg / ((heightCm / 100) ** 2);
      const sexValue = form.sex === 'male' ? 1 : 0;
      const simpleBodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexValue - 5.4;
      bodyFat = clamp(simpleBodyFat, 3, 60);
      bodyFatSource = 'bmi';
    }

    const leanBodyMass = weightKg * (1 - bodyFat / 100);
    const bmr =
      bodyFatSource === 'bmi'
        ? form.sex === 'male'
          ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
          : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
        : 370 + 21.6 * leanBodyMass;

    const multiplier = getActivityMultiplier(form.activity);
    const tdee = bmr * multiplier;
    const bmi = weightKg / ((heightCm / 100) ** 2);
    const weeklyCalories = tdee * 7;
    const activityCalories = activityOptions.map((option) => ({
      ...option,
      calories: round(bmr * option.multiplier),
    }));

    return {
      bodyFat: round1(bodyFat),
      bmr: round(bmr),
      tdee: round(tdee),
      bmi: round1(bmi),
      bmiCategory: getBmiCategory(bmi),
      weeklyCalories: round(weeklyCalories),
      activityCalories,
      bodyFatComment:
        bodyFatSource === 'bmi'
          ? '体脂肪率は BMI ベースの簡易推定です。参考値として見てください。'
          : getBodyFatComment(bodyFat, form.sex),
      bodyFatSource,
    };
  }, [form, requiredFilled, showMeasure]);

  const canShowResult = submitted && result && !result.error;

  const inputClass =
    'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-slate-900';
  const cardClass = 'rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {!canShowResult && (
          <header className="mb-8">
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              消費カロリー<span className="ml-2">計算ツール</span>
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              消費カロリーを計算できます。BMIと目安カロリーもあわせて確認できます。
            </p>
          </header>
        )}

        {!canShowResult ? (
          <div className="space-y-6">
            <section className={cardClass}>
              <div className="grid gap-4 grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">性別</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('sex', 'male')}
                      className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                        form.sex === 'male'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 ring-1 ring-slate-300'
                      }`}
                    >
                      男性
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('sex', 'female')}
                      className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                        form.sex === 'female'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 ring-1 ring-slate-300'
                      }`}
                    >
                      女性
                    </button>
                  </div>
                </div>

                {[
                  ['年齢', 'age', '30', 3],
                  ['身長', 'heightCm', '170', 3],
                  ['体重', 'weightKg', '70', 3],
                ].map(([label, key, placeholder, maxLen]) => (
                  <div key={key}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                    <input
                      className={`${inputClass} ${
                        !form[key] ? 'text-slate-400' : 'text-slate-900'
                      }`}
                      inputMode="decimal"
                      value={form[key]}
                      onChange={(e) => handleNumericChange(key, e.target.value, maxLen)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                {!showMeasure ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      体脂肪率（任意）
                    </label>
                    <input
                      className={`${inputClass} ${
                        !form.bodyFatPct ? 'text-slate-400' : 'text-slate-900'
                      }`}
                      inputMode="decimal"
                      value={form.bodyFatPct}
                      onChange={(e) => handleNumericChange('bodyFatPct', e.target.value, 2)}
                      placeholder="15"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setShowMeasure(true);
                        setForm((prev) => ({ ...prev, bodyFatPct: '' }));
                      }}
                      className="mt-2 block text-left text-sm text-blue-600 hover:underline"
                    >
                      体脂肪率がわからない方はこちら
                    </button>
                    <p className="mt-1 text-xs text-slate-500">
                      体脂肪率がわかれば、より詳細に測定することができます。
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 text-xs text-slate-500">
                      体脂肪率を推定するために必要な項目です。
                    </p>
                    {[
                      ['首周り', 'neckCm', '38', 2],
                      ['腹囲', 'waistCm', '85', 3],
                    ].map(([label, key, placeholder, maxLen]) => (
                      <div key={key}>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
                        <input
                          className={`${inputClass} ${
                            !form[key] ? 'text-slate-400' : 'text-slate-900'
                          }`}
                          inputMode="decimal"
                          value={form[key]}
                          onChange={(e) => handleNumericChange(key, e.target.value, maxLen)}
                          placeholder={placeholder}
                        />
                      </div>
                    ))}

                    {form.sex === 'female' && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">ヒップ</label>
                        <input
                          className={`${inputClass} ${
                            !form.hipCm ? 'text-slate-400' : 'text-slate-900'
                          }`}
                          inputMode="decimal"
                          value={form.hipCm}
                          onChange={(e) => handleNumericChange('hipCm', e.target.value, 3)}
                          placeholder="95"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowMeasure(false);
                        setForm((prev) => ({ ...prev, neckCm: '', waistCm: '', hipCm: '' }));
                      }}
                      className="block text-left text-sm text-blue-600 hover:underline"
                    >
                      体脂肪率がわかる場合はこちら
                    </button>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">活動量</label>
                  <select
                    className={`${inputClass} h-[56px]`}
                    value={form.activity}
                    onChange={(e) => handleChange('activity', e.target.value)}
                  >
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {submitted && result?.error && (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  {result.error}
                </p>
              )}

              <button
                type="button"
                disabled={!requiredFilled}
                onClick={() => setSubmitted(true)}
                className={`mt-6 w-full rounded-2xl px-5 py-4 text-base font-semibold transition ${
                  requiredFilled
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                計測する
              </button>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              あなたは <span className="font-semibold">{form.age}歳</span> の
              <span className="font-semibold">{form.sex === 'male' ? '男性' : '女性'}</span> で、
              身長 <span className="font-semibold">{form.heightCm}cm</span>、
              体重 <span className="font-semibold">{form.weightKg}kg</span>
              {!showMeasure && form.bodyFatPct && (
                <>
                  、体脂肪率は <span className="font-semibold">{form.bodyFatPct}%</span>
                </>
              )}
              {showMeasure && (form.neckCm || form.waistCm || (form.sex === 'female' && form.hipCm)) && (
                <>
                  、{form.neckCm && <>首周り <span className="font-semibold">{form.neckCm}cm</span></>}
                  {form.waistCm && <>、腹囲 <span className="font-semibold">{form.waistCm}cm</span></>}
                  {form.sex === 'female' && form.hipCm && (
                    <>、ヒップ <span className="font-semibold">{form.hipCm}cm</span></>
                  )}
                </>
              )}
              、活動量は{' '}
              <span className="font-semibold">
                {activityOptions.find((a) => a.value === form.activity)?.label}
              </span>{' '}
              です。
            </div>

            <section className={cardClass}>
              <p className="text-center text-sm font-medium text-slate-500">推定TDEE</p>
              <h2 className="mt-4 text-center text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                {result.tdee} kcal / 日
              </h2>
              <p className="mt-4 text-center text-lg text-slate-500">
                週あたり {result.weeklyCalories} kcal
              </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className={cardClass}>
                <h3 className="text-2xl font-bold text-slate-900">BMI</h3>
                <p className="mt-6 text-6xl font-bold tracking-tight text-slate-900">{result.bmi}</p>
                <p className="mt-6 text-lg text-slate-600">
                  BMIは <span className="font-semibold text-slate-900">{result.bmi}</span>、
                  判定は <span className="font-semibold text-slate-900">{result.bmiCategory}</span> です。
                </p>

                <div className="mt-6 space-y-0">
                  {[
                    ['18.5未満', '低体重'],
                    ['18.5〜24.9', '普通体重'],
                    ['25.0〜29.9', '肥満（1度）'],
                    ['30以上', '肥満'],
                  ].map(([range, label]) => {
                    const bmi = result.bmi;
                    let active = false;

                    if (range.includes('未満')) {
                      const max = Number(range.replace('未満', ''));
                      active = bmi < max;
                    } else if (range.includes('〜')) {
                      const [min, max] = range.split('〜').map(Number);
                      active = bmi >= min && bmi <= max;
                    } else if (range.includes('以上')) {
                      const min = Number(range.replace('以上', ''));
                      active = bmi >= min;
                    }

                    return (
                      <div
                        key={range}
                        className={`flex items-center justify-between border-t border-slate-200 px-1 py-3 ${
                          active ? 'font-semibold text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        <span>{range}</span>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-xl font-semibold">活動量ごとの消費カロリー</h3>
                <div className="mt-4 space-y-0">
                  {result.activityCalories.map((item) => {
                    const active = item.value === form.activity;
                    return (
                      <div
                        key={item.value}
                        className={`flex items-center justify-between border-t border-slate-200 px-1 py-4 ${
                          active ? 'font-semibold text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span>{item.calories} kcal / 日</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            <section className={cardClass}>
              <h3 className="text-xl font-semibold">カロリー目安</h3>
              {(() => {
                const weeklyChangeKg = Number(form.weightKg) * 0.005;
                const dailyCaloriesChange = (weeklyChangeKg * 7700) / 7;
                const cut = Math.round(result.tdee - dailyCaloriesChange);
                const maintain = result.tdee;
                const gain = Math.round(result.tdee + dailyCaloriesChange);

                return (
                  <div className="mt-4 space-y-0">
                    {[
                      ['減量', cut],
                      ['維持', maintain],
                      ['増量', gain],
                    ].map(([label, kcal]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between border-t border-slate-200 px-1 py-4"
                      >
                        <span className="text-slate-700">{label}</span>
                        <span className="font-semibold text-slate-900">{kcal} kcal / 日</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </section>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="w-full rounded-2xl bg-white px-5 py-4 text-base font-semibold text-slate-900 ring-1 ring-slate-300 transition hover:bg-slate-100"
            >
              入力に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
