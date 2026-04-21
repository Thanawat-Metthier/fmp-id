
// ─── Types ─────────────────────────────────────────────────────────────────────

import { SelectCiSchema } from "@/db/schema/core/ci";
import { log } from "@/libs/logger.lib";
import { CiService } from "@/modules/ci/ci.service";

// ─── LoginService ───────────────────────────────────────────────────────────────

export abstract class LoginService {
  static async getLoginCi(workspace?: string, customer?: string): Promise<SelectCiSchema | undefined> {
    try {

      const isRoleUser = !!workspace && !customer;
      const isCustomer = !!workspace && !!customer;


      if (isRoleUser) {
        const ciUser = await CiService.findOne({ workspace, customer: null, isActive: true });

        if (ciUser) {
          return ciUser as SelectCiSchema;
        }
      }
      if (isCustomer) {
        const ciCustomer = await CiService.findOne({ workspace, customer, isActive: true });

        if (ciCustomer) {
          return ciCustomer as SelectCiSchema;
        }
      }

      return undefined;
    } catch (error) {
      log.error('LoginService.getLoginCi', error);
      throw error;
    }
  }
}
