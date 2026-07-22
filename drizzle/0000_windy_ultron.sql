CREATE TABLE `alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL,
	`resolved_at` text
);
--> statement-breakpoint
CREATE TABLE `caregiver_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`author` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `caregivers` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`can_receive_alerts` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `check_ins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`status` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`label` text NOT NULL,
	`latitude` real,
	`longitude` real,
	`safe_zone_status` text DEFAULT 'inside' NOT NULL,
	`battery_level` integer,
	`network_status` text DEFAULT 'online' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`preferred_language` text DEFAULT 'English' NOT NULL,
	`home_address` text NOT NULL,
	`emergency_info` text DEFAULT '' NOT NULL,
	`safe_zone_name` text DEFAULT 'Home area' NOT NULL,
	`safe_zone_radius_meters` integer DEFAULT 500 NOT NULL,
	`calming_message` text DEFAULT 'Stay calm. Your family has been notified.' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
