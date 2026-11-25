// OJS REST API Type Definitions
// Based on OJS 3.5 API specification

export interface OJSLocale {
  locale: string;
  value: string;
}

export interface OJSLocalizedField {
  [locale: string]: string;
}

export interface OJSUser {
  id: number;
  username: string;
  email: string;
  firstName: OJSLocalizedField;
  middleName?: OJSLocalizedField;
  lastName: OJSLocalizedField;
  initials?: OJSLocalizedField;
  gender?: string;
  affiliation?: OJSLocalizedField;
  country?: string;
  bio?: OJSLocalizedField;
  orcid?: string;
  scopusId?: string;
  researcherId?: string;
  dateRegistered: string;
  lastLogin?: string;
  disabled: boolean;
  roles: OJSRole[];
  groups: OJSGroup[];
}

export interface OJSRole {
  id: number;
  name: OJSLocalizedField;
  description?: OJSLocalizedField;
  journalId?: number;
  stageId?: number;
}

export interface OJSGroup {
  id: number;
  name: OJSLocalizedField;
  description?: OJSLocalizedField;
}

export interface OJSJournal {
  id: number;
  name: OJSLocalizedField;
  description?: OJSLocalizedField;
  abbreviation?: OJSLocalizedField;
  currentIssue?: OJSIssue;
  issues: OJSIssue[];
  sections: OJSSection[];
  categories: OJSCategory[];
  languages: string[];
  supportedLocales: string[];
  primaryLocale: string;
  mastheadTitle?: OJSLocalizedField;
  mastheadDescription?: OJSLocalizedField;
  mastheadKeywords?: OJSLocalizedField;
  publisher?: OJSLocalizedField;
  publisherInstitution?: OJSLocalizedField;
  publisherUrl?: string;
  contactName?: string;
  contactEmail?: string;
  contactMailingAddress?: string;
  contactPhone?: string;
  contactFax?: string;
  website?: string;
  issnPrint?: string;
  issnOnline?: string;
  doiPrefix?: string;
  enableDeposit?: boolean;
  depositType?: string;
  depositUsername?: string;
  depositPassword?: string;
}

export interface OJSSection {
  id: number;
  journalId: number;
  name: OJSLocalizedField;
  abbreviation?: OJSLocalizedField;
  policy?: OJSLocalizedField;
  sequence: number;
  abstractsNotRequired: boolean;
  hideTitle: boolean;
  hideAuthor: boolean;
  hideAbstract: boolean;
  hideCitation: boolean;
}

export interface OJSCategory {
  id: number;
  journalId: number;
  name: OJSLocalizedField;
  description?: OJSLocalizedField;
  sequence: number;
}

export interface OJSIssue {
  id: number;
  journalId: number;
  volume?: string;
  number?: string;
  year: number;
  title?: OJSLocalizedField;
  description?: OJSLocalizedField;
  coverImage?: OJSFile;
  datePublished?: string;
  dateNotified?: string;
  openAccess: boolean;
  published: boolean;
  current: boolean;
  sequence: number;
  articles: OJSArticle[];
  issueIdentifiers: OJSIdentifier[];
  issueGalleys: OJSGalley[];
}

export interface OJSArticle {
  id: number;
  journalId: number;
  sectionId: number;
  sectionName?: OJSLocalizedField;
  title: OJSLocalizedField;
  abstract?: OJSLocalizedField;
  keywords?: OJSLocalizedField;
  language: string;
  currentLocale: string;
  status: number;
  statusLabel?: string;
  submissionProgress: number;
  currentStage: number;
  stageLabel?: string;
  stageStarted?: string;
  dateSubmitted: string;
  dateStatusModified?: string;
  datePublished?: string;
  dateModified?: string;
  pages?: string;
  sequence: number;
  authors: OJSAuthor[];
  reviewRounds?: OJSReviewRound[];
  galleys: OJSGalley[];
  categories: OJSCategory[];
  identifiers: OJSIdentifier[];
  citations?: string[];
  publicationHistory?: OJSPublicationHistory[];
  files?: OJSFile[];
  issue?: OJSIssue;
  doi?: string;
  openAccess?: boolean;
}

export interface OJSAuthor {
  id: number;
  userId?: number;
  firstName: OJSLocalizedField;
  middleName?: OJSLocalizedField;
  lastName: OJSLocalizedField;
  initials?: OJSLocalizedField;
  email?: string;
  url?: string;
  orcid?: string;
  affiliation?: OJSLocalizedField;
  country?: string;
  bio?: OJSLocalizedField;
  includeInBrowse: boolean;
  primaryContact: boolean;
  sequence: number;
  user?: OJSUser;
}

export interface OJSReviewRound {
  id: number;
  articleId: number;
  round: number;
  dateCreated: string;
  dateCompleted?: string;
  reviewers: OJSReviewer[];
  decisions: OJSDecision[];
}

export interface OJSReviewer {
  id: number;
  userId?: number;
  reviewRoundId: number;
  reviewerId?: number;
  email?: string;
  firstName: OJSLocalizedField;
  lastName: OJSLocalizedField;
  status: number;
  statusLabel?: string;
  dateAssigned?: string;
  dateAcknowledged?: string;
  dateCompleted?: string;
  declineReason?: string;
  reviewFile?: OJSFile;
  reviewFormResponses?: OJSReviewFormResponse[];
  reviewRecommendation?: number;
  reviewRecommendationLabel?: string;
  confidentialComment?: string;
  comment?: string;
}

export interface OJSDecision {
  id: number;
  reviewRoundId: number;
  editorId: number;
  decision: number;
  decisionLabel?: string;
  dateDecided: string;
  emailSent: boolean;
  editorNote?: string;
  authorNote?: string;
}

export interface OJSGalley {
  id: number;
  articleId: number;
  issueId?: number;
  label?: string;
  fileId: number;
  file?: OJSFile;
  html?: string;
  sequence: number;
  locale: string;
}

export interface OJSFile {
  id: number;
  uuid: string;
  originalFileName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileStage: number;
  fileStageLabel?: string;
  genreId?: number;
  genreLabel?: string;
  assocId: number;
  assocType: number;
  dateCreated: string;
  dateModified: string;
  downloadUrl?: string;
}

export interface OJSIdentifier {
  id: number;
  type: string;
  typeLabel?: string;
  identifier: string;
}

export interface OJSReviewFormResponse {
  id: number;
  reviewFormElementId: number;
  response: string;
}

export interface OJSPublicationHistory {
  date: string;
  action: string;
  actionLabel?: string;
  user?: OJSUser;
}

export interface OJSSearchParams {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filter?: Record<string, string>;
  locale?: string;
}

export interface OJSPaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  data: T[];
}

export interface OJSError {
  errorCode: number;
  message: string;
  userMessage?: string;
  developerMessage?: string;
}

// Article Status Constants (OJS 3.5)
export const ArticleStatus = {
  SUBMITTED: 1,
  IN_REVIEW: 2,
  REVIEW_COMPLETE: 3,
  QUEUED: 4,
  COPYEDITING: 5,
  PRODUCTION: 6,
  PUBLISHED: 7,
  DECLINED: 8,
  ARCHIVED: 9,
  WITHDRAWN: 10,
} as const;

// Reviewer Status Constants
export const ReviewerStatus = {
  REQUESTED: 1,
  DECLINED: 2,
  ACKNOWLEDGED: 3,
  COMPLETED: 4,
  CANCELLED: 5,
} as const;

// Decision Constants
export const Decision = {
  ACCEPT: 1,
  ACCEPT_REVISIONS: 2,
  REVISE_RESUBMIT: 3,
  RESUBMIT_REVIEW: 4,
  DECLINE: 5,
} as const;