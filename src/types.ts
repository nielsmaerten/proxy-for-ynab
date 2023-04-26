export type Configuration = {
  importPath?: string; // FIXME: Can i remove the '?' ?
  skipPathConfirmation?: boolean;
  searchSubDirectories: boolean;
  parsers: Parser[];
  bankFilePatterns: BankFilePattern[];
  ynab: {
    token: string;
    upload: boolean;
  };
  configurationDone: boolean;
  stats?: any;
};

export type BankFilePattern = {
  account_name: string;
  pattern: string;
  parser: string;
  ynab_account_id: string;
  ynab_budget_id: string;
  ynab_flag_color: string;
  upload: boolean;
  save_parsed_file: boolean;
  delete_original_file: boolean;
};

export type BankFile = {
  path: string;
  isBankFile: boolean;
  matchedPattern?: BankFilePattern;
  matchedParser?: string;
};

export type ParsedBankFile = {
  source: BankFile;
  transactions: Transaction[];
};

/**
 * A Transaction object compatible with the YNAB API
 */
export type Transaction = {
  memo: string;
  amount: number;
  date: Date;
  account_id?: string;
  flag_color?: string;
  payee_name?: string;
};

export type Parser = {
  name: string;
  columns: string[];
  delimiter: string;
  date_format: string;
  footer_rows: number;
  header_rows: number;
  outflow_indicator?: string;
  thousand_separator?: string;
  decimal_separator?: string;
};
