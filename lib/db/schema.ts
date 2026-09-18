import { pgTable, text, timestamp, boolean, integer, doublePrecision } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(), emailVerified: boolean('emailVerified').notNull().default(false), image: text('image'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
export const session = pgTable('session', { id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull(), ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull() })
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt'), updatedAt: timestamp('updatedAt') })

export const savedRegion = pgTable('saved_region', {
  id: text('id').primaryKey(), userId: text('userId').notNull(), name: text('name').notNull(), latitude: doublePrecision('latitude').notNull(), longitude: doublePrecision('longitude').notNull(), radiusKm: integer('radiusKm').notNull().default(100), createdAt: timestamp('createdAt').notNull().defaultNow(),
})
export const alertRule = pgTable('alert_rule', {
  id: text('id').primaryKey(), userId: text('userId').notNull(), name: text('name').notNull(), minMagnitude: doublePrecision('minMagnitude').notNull().default(5), enabled: boolean('enabled').notNull().default(true), createdAt: timestamp('createdAt').notNull().defaultNow(),
})
