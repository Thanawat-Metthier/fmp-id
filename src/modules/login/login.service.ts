
// ─── Types ─────────────────────────────────────────────────────────────────────

import { SelectCiSchema } from "@/db/schema/core/ci";
import { log } from "@/libs/logger.lib";
import { CiService } from "@/modules/ci/ci.service";
import { PgTx } from "@/types/database";

// ─── LoginService ───────────────────────────────────────────────────────────────

export abstract class LoginService {
  static async getLoginCi(workspace?: string, customer?: string): Promise<SelectCiSchema | undefined> {
    try {

      if (customer) {
        const ciCustomer = await CiService.findOne({ workspace, customer, isActive: true });

        if (ciCustomer) {
          return ciCustomer as SelectCiSchema;
        }
      } else {
        const ciUser = await CiService.findOne({ workspace, customer: null, isActive: true });

        if (ciUser) {
          return ciUser as SelectCiSchema;
        }
      }

      return undefined;
    } catch (error) {
      log.error('LoginService.getLoginCi', error);
      throw error;
    }
  }
}
