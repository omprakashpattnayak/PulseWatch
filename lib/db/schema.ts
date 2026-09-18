import { jsonb, numeric, pgTable, text, doublePrecision, timestamp } from 'drizzle-orm/pg-core'

export const earthquakeEvents = pgTable('earthquake_events', {
  id: text('id').primaryKey(),
  magnitude: numeric('magnitude', { precision: 4, scale: 2 }),
  place: text('place').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  latitude: doublePrecision('latitude').notNull(),
  depthKm: doublePrecision('depth_km'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  eventUrl: text('event_url'),
  rawPayload: jsonb('raw_payload').notNull().default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
