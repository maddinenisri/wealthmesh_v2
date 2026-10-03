CREATE TABLE household (
    id UUID PRIMARY KEY,
    singleton BOOLEAN NOT NULL DEFAULT TRUE CHECK (singleton),
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120 AND btrim(name) <> ''),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (singleton)
);

CREATE TABLE household_member (
    id UUID PRIMARY KEY,
    household_id UUID NOT NULL REFERENCES household(id),
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120 AND btrim(name) <> ''),
    label TEXT CHECK (label IS NULL OR (length(label) BETWEEN 1 AND 80 AND btrim(label) <> '')),
    name_key TEXT NOT NULL CHECK (name_key <> ''),
    label_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, name_key, label_key),
    UNIQUE (household_id, id)
);

CREATE TABLE checking_account (
    id UUID PRIMARY KEY,
    household_id UUID NOT NULL REFERENCES household(id),
    name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120 AND btrim(name) <> ''),
    bank TEXT CHECK (bank IS NULL OR (length(bank) BETWEEN 1 AND 120 AND btrim(bank) <> '')),
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency = 'USD'),
    opening_amount NUMERIC(14,2) NOT NULL,
    balance_date DATE NOT NULL CHECK (balance_date BETWEEN DATE '0001-01-01' AND DATE '9999-12-31'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (household_id, id)
);

CREATE TABLE checking_account_owner (
    household_id UUID NOT NULL,
    account_id UUID NOT NULL,
    member_id UUID NOT NULL,
    PRIMARY KEY (account_id, member_id),
    FOREIGN KEY (household_id, account_id) REFERENCES checking_account(household_id, id),
    FOREIGN KEY (household_id, member_id) REFERENCES household_member(household_id, id)
);
