-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Nov 27, 2025 alle 18:37
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itaca-gestionale`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `appuntamenti`
--

CREATE TABLE `appuntamenti` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL,
  `data` date NOT NULL,
  `ora` time NOT NULL,
  `durata_minuti` smallint(5) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `appuntamenti`
--

INSERT INTO `appuntamenti` (`id`, `paziente_id`, `nome`, `cognome`, `terapista_id`, `data`, `ora`, `durata_minuti`, `note`, `created_at`) VALUES
(5, 3, NULL, NULL, 2, '2025-08-18', '08:00:00', 30, 'bla bla bla', '2025-07-19 15:54:29'),
(6, NULL, 'Ciccio', 'Bruno', 7, '2025-08-18', '11:00:00', 50, 'asfdasdasda', '2025-07-19 15:54:29'),
(7, 3, NULL, NULL, 5, '2025-08-24', '17:14:00', 30, NULL, '2025-07-19 15:54:29'),
(8, 3, NULL, NULL, 5, '2025-09-05', '12:00:00', 50, 'fgdgdgd', '2025-07-19 15:54:29'),
(9, NULL, NULL, NULL, 5, '2025-09-04', '10:14:00', 30, NULL, '2025-07-19 15:54:29'),
(10, 19, NULL, NULL, 7, '2025-09-05', '10:21:00', 30, NULL, '2025-07-19 15:54:29');

-- --------------------------------------------------------

--
-- Struttura della tabella `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('ultima_pulizia', 's:10:\"2025-08-26\";', 1756319616);

-- --------------------------------------------------------

--
-- Struttura della tabella `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cartelle_cliniche`
--

CREATE TABLE `cartelle_cliniche` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED NOT NULL,
  `anamnesi` text NOT NULL,
  `diagnosi` text NOT NULL,
  `terapia` text NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `cartelle_cliniche`
--

INSERT INTO `cartelle_cliniche` (`id`, `paziente_id`, `anamnesi`, `diagnosi`, `terapia`, `note`, `created_at`, `updated_at`) VALUES
(12, 19, '', '', '', '', '2025-08-24 16:35:42', '2025-08-24 16:35:42');

-- --------------------------------------------------------

--
-- Struttura della tabella `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `firme`
--

CREATE TABLE `firme` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `terapia` varchar(255) NOT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `firme`
--

INSERT INTO `firme` (`id`, `nome`, `cognome`, `data`, `terapia`, `terapista_id`, `created_at`, `updated_at`) VALUES
(10, 'paziente', 'di test', '2025-11-16', 'fisioterapista', 2, '2025-11-16 16:09:50', '2025-11-16 16:09:50'),
(11, 'paziente', 'di test', '2025-11-16', 'psichiatra', 5, '2025-11-16 16:10:06', '2025-11-16 16:10:06');

-- --------------------------------------------------------

--
-- Struttura della tabella `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `lista_attesa`
--

CREATE TABLE `lista_attesa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `data` date DEFAULT NULL,
  `terapia` varchar(255) DEFAULT NULL,
  `terapista_id` bigint(20) UNSIGNED DEFAULT NULL,
  `chiamato` tinyint(1) NOT NULL,
  `utente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `lista_attesa`
--

INSERT INTO `lista_attesa` (`id`, `nome`, `cognome`, `telefono`, `email`, `data`, `terapia`, `terapista_id`, `chiamato`, `utente_id`, `created_at`) VALUES
(3, 'Virginia', 'Lorenzi', '44354353453', 'casalorenzi@gmail.com', '2025-08-26', 'fisioterapista', NULL, 0, 3, '2025-07-19 15:54:29');

-- --------------------------------------------------------

--
-- Struttura della tabella `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_19_155026_createutentetable', 2),
(5, '2025_03_30_171618_create_additional_tables', 3),
(6, '2025_04_04_181142_update_pagamenti_per_utenti_non_registrati', 3),
(7, '2025_04_21_184700_add_nome_cognome_to_appuntamenti_table', 3),
(8, '2025_04_21_190759_make_paziente_id_nullable_in_appuntamenti', 3),
(9, '2025_04_21_190917_make_note_nullable_in_appuntamenti', 3),
(10, '2025_06_15_183214_make_fields_nullable_in_lista_attesa', 3),
(11, '2025_06_15_184032_make_terapista_id_nullable_in_lista_attesa', 3),
(12, '2025_07_27_141916_create_tariffe_table', 4),
(13, '2025_07_31_104140_create_firme_table', 5),
(14, '2025_07_31_104932_update_terapista_in_firma_table', 6),
(15, '2025_08_11_184931_add_durata_minuti_to_appuntamenti_table', 7),
(16, '2025_08_24_164719_create_pazienti_terapisti_table', 8),
(17, '2025_08_24_174512_add_sesso_to_utente_table', 9),
(18, '2025_08_24_183027_change_sesso_column_in_utente_table', 10),
(19, '2025_11_27_183607_add_fattura_to_pagamenti_table', 11);

-- --------------------------------------------------------

--
-- Struttura della tabella `pagamenti`
--

CREATE TABLE `pagamenti` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL,
  `data` date NOT NULL,
  `importo` decimal(8,2) NOT NULL,
  `fattura` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `pagamenti`
--

INSERT INTO `pagamenti` (`id`, `paziente_id`, `nome`, `cognome`, `terapista_id`, `data`, `importo`, `fattura`, `created_at`) VALUES
(23, 20, NULL, NULL, 2, '2025-11-16', 20.00, 0, '2025-07-19 15:54:29');

-- --------------------------------------------------------

--
-- Struttura della tabella `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pazienti_terapisti`
--

CREATE TABLE `pazienti_terapisti` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED NOT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL,
  `data` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `pazienti_terapisti`
--

INSERT INTO `pazienti_terapisti` (`id`, `paziente_id`, `terapista_id`, `data`, `created_at`, `updated_at`) VALUES
(3, 4, 2, '0000-00-00', NULL, NULL),
(4, 3, 5, '2025-09-05', '2025-09-05 19:11:51', '2025-09-05 19:11:51'),
(5, 19, 5, '2025-09-05', '2025-09-05 19:18:02', '2025-09-05 19:18:02'),
(6, 19, 7, '2025-09-05', '2025-09-05 19:21:30', '2025-09-05 19:21:30');

-- --------------------------------------------------------

--
-- Struttura della tabella `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `staff_dati`
--

CREATE TABLE `staff_dati` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `utente_id` bigint(20) UNSIGNED NOT NULL,
  `professione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `staff_dati`
--

INSERT INTO `staff_dati` (`id`, `utente_id`, `professione`) VALUES
(2, 2, 'fisioterapista'),
(3, 5, 'psichiatra'),
(4, 6, 'logopedista'),
(5, 7, 'fisioterapista'),
(6, 9, 'Oculista');

-- --------------------------------------------------------

--
-- Struttura della tabella `tariffe`
--

CREATE TABLE `tariffe` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `utente_id` bigint(20) UNSIGNED NOT NULL,
  `terapia` varchar(255) NOT NULL,
  `prezzo` decimal(8,2) NOT NULL,
  `durata` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `nascita` date DEFAULT NULL,
  `sesso` enum('M','F') DEFAULT NULL,
  `ruolo` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`id`, `nome`, `cognome`, `username`, `password`, `email`, `telefono`, `nascita`, `sesso`, `ruolo`, `created_at`, `updated_at`) VALUES
(2, 'Carlo', 'De Maria', 'carlo.demaria', '$2y$12$BjGpfQDWCNt26Vkvm1cHbeNn1v/NBQ.j2DC1HFkiRXE5Ok9EBy1rG', 'demaria@gmail.com', '324354545', '1997-05-01', 'M', 'staff', '2025-07-19 14:01:17', '2025-09-05 19:16:55'),
(3, 'Virginia', 'Lorenzi', 'virginia.lorenzi', '$2y$12$87UDsS5GXg.SRMxxYm50A.7Mfpv3kQ1bcEMo9utapN.ufmHZRRz2G', 'casalorenzi@gmail.com', '44354353453', '2019-05-13', 'F', 'paziente', '2025-07-19 14:02:05', '2025-09-05 19:11:51'),
(4, 'Marco', 'Verdoni', 'marco.verdoni', '$2y$12$Z9c3Mp2xSp3t0xi2Vo9u/.bmvzolnpyZRy1um1Vi6lUusonzSBS7q', 'verdoni@outlook.it', '3454534534', '2021-09-03', NULL, 'paziente', '2025-07-19 14:03:02', '2025-07-19 14:03:02'),
(5, 'Gabriele', 'Spina', 'gabriele.spina', '$2y$12$yKALrZLci/1kOCGXwPASxuApL141AL8mwcGwqH.anLinDJwRKmLKG', 'spinag@gmail.com', '432545345435', '1994-04-12', NULL, 'staff', '2025-07-20 07:47:53', '2025-07-20 07:47:53'),
(6, 'Veronica', 'Giustolisi', 'veronica.giustolisi', '$2y$12$/cMiFzT3xDt5uitaVV0yXOh37sfGlaBkhQmOv.Jm4MB9N65zdl7M.', 'giustolisidoc@gmail.com', '423423432', '1997-11-08', NULL, 'staff', '2025-07-20 07:48:34', '2025-07-20 07:48:34'),
(7, 'Fabrizio', 'Veronesi', 'fabrizio.veronesi', '$2y$12$MgsABjeRn2C9.F0CkDXPpeqmC/2ImUpBi2F4jCBot2s4Zg3KDPI4O', 'veronesi@outlook.com', '234324324324', '1995-05-23', NULL, 'staff', '2025-07-20 07:49:58', '2025-07-20 07:49:58'),
(8, 'Amministratore', 'Sistema', 'admin', '$2y$12$Y2pbP62AvYTfgiIAsnF62e7GswlT0ovtAL6s5y4rX89xIMfEx8JHi', 'admin@example.com', '0000000000', '1990-01-01', NULL, 'admin', '2025-08-11 15:43:41', '2025-08-11 15:43:41'),
(9, 'Domenico', 'Messina', 'domenico.messina', '$2y$12$3vZty2IMPeB1nxgCzZWlQ./GSWfANXhut9PqQ0t9/mcUGh2qJsSzm', 'domenicomess@gmail.com', '39283453113', '1995-04-01', NULL, 'staff', '2025-08-24 15:53:36', '2025-08-24 15:53:36'),
(19, 'Cecilia', 'Grasso', 'cecilia.grasso', '$2y$12$08Pi3u0cSSuYAUUd9UUA5.5XZeYPGJDNLTVO7dWbdVBQBv37207Am', 'grassoceci@gmail.com', '46457567567', '2025-08-24', 'F', 'paziente', '2025-08-24 16:35:42', '2025-08-24 16:35:42'),
(20, 'paziente', 'di test', 'pazienteTest', '$2y$10$npe6kV116IzI33Ubf7q2L.JL7QxfkhHAyB.ztaEWdXbgfZ7FRwCo2', 'pazientetest@gmail.com', '3641247964', NULL, 'F', 'paziente', NULL, NULL);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `appuntamenti`
--
ALTER TABLE `appuntamenti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appuntamenti_paziente_id_foreign` (`paziente_id`),
  ADD KEY `appuntamenti_terapista_id_foreign` (`terapista_id`);

--
-- Indici per le tabelle `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indici per le tabelle `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indici per le tabelle `cartelle_cliniche`
--
ALTER TABLE `cartelle_cliniche`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cartelle_cliniche_paziente_id_unique` (`paziente_id`);

--
-- Indici per le tabelle `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indici per le tabelle `firme`
--
ALTER TABLE `firme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firme_terapista_id_foreign` (`terapista_id`);

--
-- Indici per le tabelle `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indici per le tabelle `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `lista_attesa`
--
ALTER TABLE `lista_attesa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lista_attesa_terapista_id_foreign` (`terapista_id`),
  ADD KEY `lista_attesa_utente_id_foreign` (`utente_id`);

--
-- Indici per le tabelle `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `pagamenti`
--
ALTER TABLE `pagamenti`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pagamenti_terapista_id_foreign` (`terapista_id`),
  ADD KEY `pagamenti_paziente_id_foreign` (`paziente_id`);

--
-- Indici per le tabelle `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indici per le tabelle `pazienti_terapisti`
--
ALTER TABLE `pazienti_terapisti`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indici per le tabelle `staff_dati`
--
ALTER TABLE `staff_dati`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_dati_utente_id_unique` (`utente_id`);

--
-- Indici per le tabelle `tariffe`
--
ALTER TABLE `tariffe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tariffe_utente_id_foreign` (`utente_id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utente_username_unique` (`username`),
  ADD UNIQUE KEY `utente_email_unique` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `appuntamenti`
--
ALTER TABLE `appuntamenti`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `cartelle_cliniche`
--
ALTER TABLE `cartelle_cliniche`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `firme`
--
ALTER TABLE `firme`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT per la tabella `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `lista_attesa`
--
ALTER TABLE `lista_attesa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT per la tabella `pagamenti`
--
ALTER TABLE `pagamenti`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT per la tabella `pazienti_terapisti`
--
ALTER TABLE `pazienti_terapisti`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `staff_dati`
--
ALTER TABLE `staff_dati`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `tariffe`
--
ALTER TABLE `tariffe`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `appuntamenti`
--
ALTER TABLE `appuntamenti`
  ADD CONSTRAINT `appuntamenti_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appuntamenti_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `cartelle_cliniche`
--
ALTER TABLE `cartelle_cliniche`
  ADD CONSTRAINT `cartelle_cliniche_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `firme`
--
ALTER TABLE `firme`
  ADD CONSTRAINT `firme_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `lista_attesa`
--
ALTER TABLE `lista_attesa`
  ADD CONSTRAINT `lista_attesa_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lista_attesa_utente_id_foreign` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`) ON DELETE SET NULL;

--
-- Limiti per la tabella `pagamenti`
--
ALTER TABLE `pagamenti`
  ADD CONSTRAINT `pagamenti_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pagamenti_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `staff_dati`
--
ALTER TABLE `staff_dati`
  ADD CONSTRAINT `staff_dati_utente_id_foreign` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `tariffe`
--
ALTER TABLE `tariffe`
  ADD CONSTRAINT `tariffe_utente_id_foreign` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
