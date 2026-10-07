import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';
// TODO ขั้นที่ 4 (Lab): import { useEffect, useState } from 'react' และ import { getWishlist } from '../api/backend';

// หน้า "รายการที่อยากดู" ของสมาชิกที่ login อยู่ (เส้นทาง /me/wishlist ครอบด้วย ProtectedRoute แล้ว)
function Wishlist() {
  const { member, token } = useAuth();           // ดึง token มาเพิ่มเติมเพื่อใช้ดึงข้อมูล

  // เปลี่ยน 3 ค่าคงที่ให้กลายเป็น state
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  // โหลดข้อมูลเมื่อคอมโพเนนต์ทำงานหรือเมื่อ token เปลี่ยนแปลง
  useEffect(() => {
    let ignore = false;                          // ธงกันคำตอบเก่ามาทับคำตอบใหม่

    async function load() {
      setStatus('loading');
      try {
        const list = await getWishlist(token);   // เรียก API เพื่อดึง wishlist ด้วย token
        if (!ignore) {
          setMovies(list.items);                 // นำอาร์เรย์ items ที่ได้มาอัปเดตลง state ของ movies
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    }
    
    if (token) {
      load();
    }

    return () => { ignore = true; };             // cleanup: effect รอบเก่าถูกยกเลิก
  }, [token]);                                   // dependency เป็น [token]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">รายการที่อยากดูของ {member?.displayName}</h1>
      <p className="mb-6 text-sm text-slate-500">กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่</p>
      <MovieGrid movies={movies} status={status} error={error} />
    </div>
  );
}

export default Wishlist;
