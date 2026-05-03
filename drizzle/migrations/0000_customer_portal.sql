/** Customer portal tables — run against DB that already has Service, etc. */
CREATE TABLE IF NOT EXISTS "CustomerUser" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "CustomerUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CustomerOrder" (
	"id" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"serviceId" text NOT NULL,
	"planIndex" integer NOT NULL,
	"planSnapshot" jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"amountRial" integer NOT NULL,
	"currency" text DEFAULT 'IRR' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"provider" text NOT NULL,
	"authority" text,
	"refId" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"rawPayload" jsonb,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ContractAcceptance" (
	"id" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"orderId" text NOT NULL,
	"termsVersion" text NOT NULL,
	"termsHash" text,
	"acceptedAt" timestamp (3) DEFAULT now() NOT NULL,
	"ip" text DEFAULT '' NOT NULL,
	"userAgent" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SupportTicket" (
	"id" text PRIMARY KEY NOT NULL,
	"customerId" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TicketMessage" (
	"id" text PRIMARY KEY NOT NULL,
	"ticketId" text NOT NULL,
	"fromCustomer" boolean NOT NULL,
	"body" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_customerId_CustomerUser_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."CustomerUser"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerOrder" ADD CONSTRAINT "CustomerOrder_serviceId_Service_id_fk" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_CustomerOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."CustomerOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContractAcceptance" ADD CONSTRAINT "ContractAcceptance_customerId_CustomerUser_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."CustomerUser"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContractAcceptance" ADD CONSTRAINT "ContractAcceptance_orderId_CustomerOrder_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."CustomerOrder"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_customerId_CustomerUser_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."CustomerUser"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_ticketId_SupportTicket_id_fk" FOREIGN KEY ("ticketId") REFERENCES "public"."SupportTicket"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ContractAcceptance_orderId_key" ON "ContractAcceptance" USING btree ("orderId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "CustomerOrder_customerId_idx" ON "CustomerOrder" USING btree ("customerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "PaymentTransaction_orderId_idx" ON "PaymentTransaction" USING btree ("orderId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "SupportTicket_customerId_idx" ON "SupportTicket" USING btree ("customerId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TicketMessage_ticketId_idx" ON "TicketMessage" USING btree ("ticketId");
