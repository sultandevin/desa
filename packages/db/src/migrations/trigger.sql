--> statement-breakpoint
-- Trigger to log asset changes to assset_audit
CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
BEGIN 
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, after, user_id)
    VALUES (NEW.id, 'INSERT', to_json(NEW), current_user);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, before, after, user_id)
    VALUES (OLD.id, 'UPDATE', to_json(OLD), to_json(NEW), current_user);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "asset_audit" (asset_id, transaction, before, user_id)
    VALUES (OLD.id, 'DELETE', to_json(OLD), current_user);
    RETURN OLD;
  END IF;
RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asset_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON asset
FOR EACH ROW EXECUTE FUNCTION log_asset_changes();
