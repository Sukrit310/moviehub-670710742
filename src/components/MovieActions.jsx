import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { putVote, addToWishlist, removeFromWishlist } from '../api/backend';
// TODO ขั้นที่ 5 (Lab): import { putVote, addToWishlist, removeFromWishlist } from '../api/backend';

// แถบปุ่มใต้ชื่อหนัง: ให้คะแนน 1 ถึง 10 และปุ่มเพิ่มเข้า wishlist (ต้อง login)
function MovieActions({ movieId }) {
  const { isLoggedIn, token } = useAuth();       // ดึง token มาด้วย เพื่อส่งให้ putVote / addToWishlist และ removeFromWishlist
  const [myScore, setMyScore] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isLoggedIn) {
    return (
      <p className="mt-4 text-sm text-slate-500">
        <Link to="/login" className="text-emerald-600 hover:underline">เข้าสู่ระบบ</Link> เพื่อให้คะแนนและเพิ่มเข้ารายการที่อยากดู
      </p>
    );
  }

  async function handleVote(score) {
    try {
      setMessage('กำลังบันทึก...');
      await putVote(movieId, score, token);      // ยิง API ก่อน
      setMyScore(score);                         // ถ้าเซิร์ฟเวอร์ตอบกลับสำเร็จ ค่อยปรับเปลี่ยน state บนจอ
      setMessage('บันทึกคะแนนสำเร็จ');
    } catch (err) {
      setMessage(err.message);                   // ถ้าเซิร์ฟเวอร์ตอบ error ให้แสดงข้อความและไม่เปลี่ยนค่า state
    }
  }

  async function handleWishlist() {
    try {
      setMessage('กำลังอัปเดต...');
      if (inWishlist) {
        await removeFromWishlist(movieId, token); // ถ้าอยู่ใน wishlist แล้วให้เอาออก
      } else {
        await addToWishlist(movieId, token);      // ถ้ายังไม่อยู่ใน wishlist ให้เพิ่มเข้าไป
      }
      setInWishlist(!inWishlist);                 // สลับค่า state เมื่อส่งไป API สำเร็จ
      setMessage(null);
    } catch (err) {
      setMessage(err.message);                    // ถ้า error จะตกมาที่ catch และไม่สลับค่าใน state
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-2 text-sm text-slate-500">ให้คะแนน</span>
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => handleVote(n)}
                  className={'h-8 w-8 rounded-lg border text-sm ' +
                    (myScore === n ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50')}>
            {n}
          </button>
        ))}
      </div>
      <button onClick={handleWishlist}
              className={'rounded-lg border px-4 py-2 text-sm ' +
                (inWishlist ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-emerald-200 bg-white text-slate-600 hover:bg-emerald-50')}>
        {inWishlist ? '❤️ อยู่ในรายการที่อยากดูแล้ว' : '🤍 เพิ่มเข้ารายการที่อยากดู'}
      </button>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  );
}

export default MovieActions;
