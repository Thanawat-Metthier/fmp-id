import { Cookie } from 'elysia';

export abstract class LoginCookieUtils {
  /**
   * อ่านค่า workspace และ customer จาก cookie
   */
  static get(cookie: Record<string, Cookie<unknown>>) {
    const workspace = cookie.id_workspace?.value as string | undefined;
    const customer = cookie.id_customer?.value as string | undefined;

    return { workspace, customer };
  }

  /**
   * กำหนดค่า workspace และ customer ลงใน cookie
   * หาก parameter ไม่มีค่า จะทำการลบ cookie ทิ้ง
   */
  static set(cookie: Record<string, Cookie<unknown>>, workspace?: string | null, customer?: string | null) {
    if (workspace) {
      cookie.id_workspace?.set({ value: workspace, path: '/' });
    } else {
      cookie.id_workspace?.remove();
    }

    if (customer) {
      cookie.id_customer?.set({ value: customer, path: '/' });
    } else {
      cookie.id_customer?.remove();
    }
  }

  /**
   * ลบ cookie ที่เกี่ยวข้องทั้งหมด
   */
  static remove(cookie: Record<string, Cookie<unknown>>) {
    cookie.id_workspace?.remove();
    cookie.id_customer?.remove();
  }
}
