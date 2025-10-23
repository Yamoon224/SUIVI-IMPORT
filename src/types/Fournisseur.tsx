// src/types/fournisseur.ts

// Fournisseur simple
export interface Fournisseur {
  id: number;
  codeFournisseur: string;
  intituleFournisseur?: string;
  dateCreation?: string;
  nomContact?: string;
  telephone?: string;
  telecopie?: string;
  email?: string;
  siret?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  status?: number;
}

// Si ton backend renvoie une liste paginée
export interface PaginatedFournisseur {
  content: Fournisseur[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface FournisseurCentraleDto {
  idFournisseurCentrale: number;
  fournisseursIds: Fournisseur[];
}
