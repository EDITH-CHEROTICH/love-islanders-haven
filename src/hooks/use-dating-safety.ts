
import { useSafetyContacts, type SafetyContact } from './safety/use-safety-contacts';
import { useDatePlans, type DatePlan } from './safety/use-date-plans';

export { type SafetyContact, type DatePlan };

export function useDatingSafety() {
  const safetyContactsHook = useSafetyContacts();
  const datePlansHook = useDatePlans();

  return {
    ...safetyContactsHook,
    ...datePlansHook
  };
}
