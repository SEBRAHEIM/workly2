-- Add WhatsApp phone column to profiles
alter table profiles add column if not exists whatsapp_phone text;
