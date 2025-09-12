# 1. Config .env

สร้างไฟล์ .env ไว้ที่ root directory ของโปรเจกต์ และเพิ่มพารามิเตอร์นี้:

DATABASE_URL="URL"

### 4. วิธีหา URL (จาก Supabase):

1. เข้าไปใน Project ที่ถูกเชิญใน Supabase

2. กดปุ่ม Connect ที่แถบด้านบน

3. เลือก Type = URI และ Source = Primary Database จะมี 2 ตัวเลือก:

    Direct Connection → ลงท้ายด้วย port 5432 ❌ ผมใช้ไม่ได้ router ที่บ้านบล็อค)

    Transaction Pooler → ลงท้ายด้วย port 6543 ✅ แนะนำให้ใช้

4. Copy URL ที่ได้มา แล้วจะเห็น [YOUR-PASSWORD] อยู่ท้ายลิงก์

5. ให้นำรหัสจริงจากไฟล์ supabase.txt มาแทนที่ --> พร้อมใช้
