ALTER TABLE `caregivers` ADD `access_level` text DEFAULT 'backup' NOT NULL;
--> statement-breakpoint
CREATE TABLE `consent_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patient_id` text NOT NULL,
	`scope` text NOT NULL,
	`allowed` integer NOT NULL,
	`actor` text NOT NULL,
	`created_at` text NOT NULL
);
