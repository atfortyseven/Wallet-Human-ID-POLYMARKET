import { z } from 'zod';

// ============================================================================
// HUMANID.FI - USER SETTINGS VALIDATION SCHEMA
// ============================================================================

/**
 * Contact Interface
 */
export const ContactSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(100),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  memo: z.string().max(500).optional(),
});

export type ContactType = z.infer<typeof ContactSchema>;

/**
 * Notifications Config Interface
 */
export const NotificationsConfigSchema = z.object({
  governance: z.boolean(),
  transactional: z.boolean(),
  security: z.boolean(),
});

export type NotificationsConfig = z.infer<typeof NotificationsConfigSchema>;

/**
 * Complete User Settings Schema
 * This validates ALL user settings fields for robust data integrity
 */
export const UserSettingsSchema = z.object({
  // Appearance & UI
  theme: z.enum(['light', 'dark', 'auto'], {
    errorMap: () => ({ message: 'Theme must be light, dark, or auto' }),
  }),
  language: z.enum(['en', 'es', 'fr', 'pt'], {
    errorMap: () => ({ message: 'Language must be en, es, fr, or pt' }),
  }),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'MXN'], {
    errorMap: () => ({ message: 'Invalid currency' }),
  }),
  searchEngine: z.enum(['Google', 'DuckDuckGo', 'Brave'], {
    errorMap: () => ({ message: 'Invalid search engine' }),
  }),

  // Privacy & Security
  showProfile: z.boolean(),
  showActivity: z.boolean(),
  hideBalances: z.boolean(),
  privacyMode: z.boolean(),
  strictMode: z.boolean(),
  humanMetrics: z.boolean(),

  // Notifications
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  transactionAlerts: z.boolean(),
  marketingEmails: z.boolean(),

  // Telegram Settings
  telegramEnabled: z.boolean(),
  telegramChatId: z.string().nullable().optional(),
  telegramTopicId: z.string().nullable().optional(),
  telegramUsername: z.string().nullable().optional(),
  whaleThreshold: z.number().min(0).max(10000000),

  // Trading
  defaultSlippage: z.number().min(0).max(100),
  defaultGasPrice: z.enum(['low', 'medium', 'high']),
  confirmTransactions: z.boolean(),

  // Smart Wallet Security
  walletStealthMode: z.boolean(),
  requirePasswordForSigning: z.boolean(),
  autoLockDuration: z.number().min(1).max(1440), // 1 minute to 24 hours

  // Advanced Settings
  testNetsEnabled: z.boolean(),
  ipfsGateway: z.string().url().optional().or(z.literal('')),
  customRPC: z.string().url().nullable().optional().or(z.literal('')),
  stateLogsEnabled: z.boolean(),

  // Contacts
  contacts: z.array(ContactSchema),

  // Notifications granular
  notifications: NotificationsConfigSchema,

  // Backup
  lastBackupAt: z.date().nullable().optional(),
  backupFrequency: z.enum(['daily', 'weekly', 'monthly']),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

/**
 * Partial schema for updating individual fields
 */
export const PartialUserSettingsSchema = UserSettingsSchema.partial();

export type PartialUserSettings = z.infer<typeof PartialUserSettingsSchema>;

/**
 * Field-level update schema
 */
export const FieldUpdateSchema = z.object({
  field: z.string(),
  value: z.any(),
});

/**
 * Validate user settings object
 */
export function validateUserSettings(data: unknown): {
  success: boolean;
  data?: UserSettings;
  errors?: z.ZodError;
} {
  try {
    const validated = UserSettingsSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Validate partial settings (for PATCH operations)
 */
export function validatePartialSettings(data: unknown): {
  success: boolean;
  data?: Partial<UserSettings>;
  errors?: z.ZodError;
} {
  try {
    const validated = PartialUserSettingsSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Get default user settings
 */
export function getDefaultUserSettings(): UserSettings {
  return {
    // Appearance & UI
    theme: 'light',
    language: 'es',
    currency: 'USD',
    searchEngine: 'Google',

    // Privacy & Security
    showProfile: true,
    showActivity: false,
    hideBalances: false,
    privacyMode: true,
    strictMode: false,
    humanMetrics: false,

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    marketingEmails: false,

    // Telegram Settings
    telegramEnabled: false,
    telegramChatId: null,
    telegramTopicId: null,
    telegramUsername: null,
    whaleThreshold: 50000,

    // Trading
    defaultSlippage: 0.5,
    defaultGasPrice: 'medium',
    confirmTransactions: true,

    // Smart Wallet Security
    walletStealthMode: false,
    requirePasswordForSigning: true,
    autoLockDuration: 15,

    // Advanced Settings
    testNetsEnabled: false,
    ipfsGateway: 'https://ipfs.io/ipfs/',
    customRPC: null,
    stateLogsEnabled: false,

    // Contacts
    contacts: [],

    // Notifications granular
    notifications: {
      governance: true,
      transactional: true,
      security: true,
    },

    // Backup
    lastBackupAt: null,
    backupFrequency: 'weekly',
  };
}
