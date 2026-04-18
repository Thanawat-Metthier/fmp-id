# FMP ID (ElysiaJS x Bun)

โปรเจกต์ระบบ Backend `fmp-id` สำหรับการจัดการ Services ต่างๆ ด้วย **ElysiaJS** บน Runtime ของ **Bun**

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Runtime)
- PostgreSQL Database

### Installation
1. ติดตั้ง Dependencies ในระบบ:
```bash
bun install
```

2. สร้างไฟล์ `.env` ตามโครงสร้างของ `.env.example`:
```bash
cp .env.example .env
```
*(จากนั้นให้แก้ไขค่า Connection ของ Database ในไฟล์ `.env` ให้เชื่อมต่อกับฐานข้อมูลของคุณ)*

---

## 🗄️ Database Management (Drizzle ORM)

ระบบใช้ **Drizzle ORM** ร่วมกับตระกูล **pg** ในการจัดการและเชื่อมต่อกับ PostgreSQL โดยมีโครงสร้างคำสั่งสำหรับจัดการฐานข้อมูลดังนี้:

| Command | Description |
|---|---|
| `bun run db:generate` | แปลงโค้ด Drizzle Schema (`src/db/schema/core/*.ts`) ให้เป็นไฟล์ SQL สำหรับ Migration |
| `bun run db:migrate` | นำไฟล์ SQL Migration ไปรันบน Database จริง เพื่ออัปเดตตาราง |
| `bun run db:pull` | อัปเดตโค้ด Schema ในโปรเจกต์ จากโครงสร้างที่มีอยู่บน Database ณ ปัจจุบัน |
| `bun run db:studio` | เปิดหน้า Web UI สำหรับบริหารจัดการ Database ของคุณผ่านเบราว์เซอร์ |
| `bun run db:seed` | รันโค้ดเขียนข้อมูลจำลอง (Mock/Seed) ที่ไฟล์ `src/db/seed.ts` ลงตาราง |

### 🔍 วิธีการสร้างและจัดการ Schema
ไฟล Schema สำหรับระบบจะถูกเก็บไว้ที่: `src/db/schema/core/index.ts`
1. สร้างไฟล์และเขียน Schema ด้วย `drizzle-orm` (ตัวอย่างสร้าง Table)
2. นำ Schema มารวมและ Export ผ่าน `src/db/schema/core/index.ts`
3. รัน `bun run db:generate` เพื่อสร้าง Migration script
4. รัน `bun run db:migrate` เพื่อให้โครงสร้างถูกนำไปอัปเดตบน Server ปลายทาง

---

## 👨‍💻 Development

### การรันเซิร์ฟเวอร์
เริ่มต้นเซิร์ฟเวอร์สำหรับการพัฒนา (พร้อมระบบ Hot-reload):
```bash
bun run dev
```

### การเรียกใช้งาน Database ใน Code
เราเตรียม Utility สำหรับการใช้งานฐานข้อมูลที่รองรับ **Reader/Writer Replicas** ไว้ โดยสามารถเรียกได้ผ่าน `src/db/index.ts`:

```typescript
import { getDb, withTransaction } from '@/db';

// การใช้งานในโหมดอ่านข้อมูล
const dbReader = await getDb('query');
const users = await dbReader.select().from(schema.users);

// การใช้งานโหมดจัดการ/เปลี่ยนแปลงข้อมูล
const dbWriter = await getDb('mutation');
await dbWriter.insert(schema.users).values({ name: 'John' });

// การใช้งานผ่าน Transaction
await withTransaction(async (tx) => {
  await tx.insert(schema.users).values(...);
  await tx.update(schema.profiles).set(...);
});
```

---

## 📂 Project Structure Overview

```text
fmp-id/
├── drizzle/                  # โฟลเดอร์เก็บ Drizzle Migrations (SQL)
├── src/
│   ├── config/
│   │   └── config.ts         # รวบรวมการเรียกใช้ Environment Variables ทั้งระบบ
│   ├── db/
│   │   ├── schema/           # เก็บ Schema ไฟล์ที่ประกาศ Table / Types ของ ORM
│   │   ├── connection.ts     # สร้าง Reader/Writer Pools จัดการ Connection 
│   │   ├── index.ts          # Helpers ใช้งาน Database
│   │   └── seed.ts           # สคริปต์ Mock ข้อมูลตั้งต้น
│   ├── types/
│   │   └── database.ts       # Type Utility เช่น `PgTx` 
│   └── index.tsx             # จุดเริ่มต้น Server
├── drizzle.config.ts         # ไฟล์ตั้งค่าให้ Drizzle Kit ชี้หา Config DB ปกติของระบบ
└── package.json
```