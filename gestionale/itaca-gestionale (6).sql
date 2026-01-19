-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Gen 19, 2026 alle 12:16
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
  `is_group` tinyint(1) NOT NULL DEFAULT 0,
  `titolo` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `appuntamenti`
--

INSERT INTO `appuntamenti` (`id`, `paziente_id`, `nome`, `cognome`, `terapista_id`, `data`, `ora`, `durata_minuti`, `is_group`, `titolo`, `note`, `created_at`) VALUES
(5, 3, NULL, NULL, 2, '2025-08-18', '08:00:00', 30, 0, NULL, 'bla bla bla', '2025-07-19 15:54:29'),
(6, NULL, 'Ciccio', 'Bruno', 7, '2025-08-18', '11:00:00', 50, 0, NULL, 'asfdasdasda', '2025-07-19 15:54:29'),
(7, 3, NULL, NULL, 5, '2025-08-24', '17:14:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(8, 3, NULL, NULL, 5, '2025-09-05', '12:00:00', 50, 0, NULL, 'fgdgdgd', '2025-07-19 15:54:29'),
(9, NULL, NULL, NULL, 5, '2025-09-04', '10:14:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(10, 19, NULL, NULL, 7, '2025-09-05', '10:21:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(11, 4, NULL, NULL, 19, '2025-12-07', '16:45:24', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(12, NULL, 'utente', 'di prova', 21, '2025-12-07', '17:46:24', 50, 0, NULL, NULL, '2025-07-19 15:54:29'),
(13, 3, NULL, NULL, 21, '2025-12-07', '17:00:00', 28, 0, NULL, 'dxvsdfsd', '2025-07-19 15:54:29'),
(14, NULL, 'ciccio', 'ciccio', 2, '2025-12-07', '12:00:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(15, 20, NULL, NULL, 2, '2025-12-19', '10:40:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(16, 20, NULL, NULL, 21, '2025-12-19', '15:40:00', 50, 0, NULL, NULL, '2025-07-19 15:54:29'),
(17, 3, NULL, NULL, 2, '2025-12-21', '19:50:00', 45, 0, NULL, NULL, '2025-07-19 15:54:29'),
(18, 19, NULL, NULL, 5, '2025-12-21', '09:45:00', 30, 0, NULL, 'dadasdasdasd', '2025-07-19 15:54:29'),
(19, NULL, 'Giorgio', 'Aiello', 9, '2025-12-21', '19:50:00', 30, 0, NULL, 'ibuhvuhvytctfctc', '2025-07-19 15:54:29'),
(20, 20, NULL, NULL, 6, '2025-12-21', '14:00:00', 45, 0, NULL, NULL, '2025-07-19 15:54:29'),
(21, 4, NULL, NULL, 7, '2025-12-21', '22:03:00', 15, 0, NULL, 'xvcfzcz', '2025-07-19 15:54:29'),
(22, 20, NULL, NULL, 2, '2025-12-22', '10:03:00', 60, 0, NULL, 'ciao ciao', '2025-07-19 15:54:29'),
(23, 27, NULL, NULL, 2, '2025-12-27', '16:31:00', 35, 0, NULL, NULL, '2025-07-19 15:54:29'),
(24, 3, NULL, NULL, 5, '2025-12-30', '13:19:00', 50, 0, NULL, 'fcvxzfsd', '2025-07-19 15:54:29'),
(25, NULL, NULL, NULL, 21, '2026-01-01', '17:14:00', 48, 1, 'terapia di gruppo', NULL, '2025-07-19 15:54:29'),
(28, 3, NULL, NULL, 2, '2026-01-10', '23:28:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(29, 3, NULL, NULL, 2, '2026-01-15', '11:06:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(30, 4, NULL, NULL, 5, '2026-01-15', '12:06:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(31, 19, NULL, NULL, 6, '2026-01-15', '13:12:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(32, 20, NULL, NULL, 7, '2026-01-15', '14:07:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(33, 3, NULL, NULL, 2, '2026-01-19', '11:11:00', 45, 0, NULL, NULL, '2025-07-19 15:54:29'),
(34, 4, NULL, NULL, 9, '2026-01-19', '14:11:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(35, 19, NULL, NULL, 6, '2026-01-19', '10:11:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29'),
(36, 3, NULL, NULL, 37, '2026-01-19', '12:14:00', 30, 0, NULL, NULL, '2025-07-19 15:54:29');

-- --------------------------------------------------------

--
-- Struttura della tabella `appuntamento_paziente`
--

CREATE TABLE `appuntamento_paziente` (
  `appuntamento_id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `appuntamento_paziente`
--

INSERT INTO `appuntamento_paziente` (`appuntamento_id`, `paziente_id`) VALUES
(25, 3),
(25, 19),
(25, 20);

-- --------------------------------------------------------

--
-- Struttura della tabella `appuntamento_terapista`
--

CREATE TABLE `appuntamento_terapista` (
  `appuntamento_id` bigint(20) UNSIGNED NOT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `appuntamento_terapista`
--

INSERT INTO `appuntamento_terapista` (`appuntamento_id`, `terapista_id`) VALUES
(25, 2),
(25, 21);

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
('ultima_pulizia', 's:10:\"2026-01-12\";', 1768330371);

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
-- Struttura della tabella `cartella_clinica_files`
--

CREATE TABLE `cartella_clinica_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `cartelle_cliniche`
--

CREATE TABLE `cartelle_cliniche` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED NOT NULL,
  `anamnesi` text DEFAULT NULL,
  `diagnosi` text DEFAULT NULL,
  `terapia` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `cartelle_cliniche`
--

INSERT INTO `cartelle_cliniche` (`id`, `paziente_id`, `anamnesi`, `diagnosi`, `terapia`, `note`, `created_at`, `updated_at`) VALUES
(1, 30, NULL, 'eyJpdiI6ImhsM0FsSVhvRDRQVEwxcTVxUVhCWFE9PSIsInZhbHVlIjoiZWh5Q0VWemtkWVVZckdKK0VxeXVMQT09IiwibWFjIjoiNjQ4OGQzNDJhNGE1M2QzYmUzMGVkMWJhMDc2ZTQ1NWJiNjk0YmViNmI5YWYzNjMwZDZiNTk5OTcxMmQ5YzZmNCIsInRhZyI6IiJ9', 'eyJpdiI6Ilo4eEtOaENxVGc3N2piU0NERGRsTUE9PSIsInZhbHVlIjoiUm51UzI2WVdQWGFsWjc3RFJsOWtzZz09IiwibWFjIjoiZjlhM2M1NDkzNGRlNzA4Yjg0ZWU1YWZiOWI4NGUzODc2MDRiYTk5YjgxMWRkNWFhODkwZjVmNGQ1NjY4YWIwOSIsInRhZyI6IiJ9', NULL, '2026-01-06 17:22:00', '2026-01-07 11:58:13'),
(2, 31, 'eyJpdiI6IjUxZVpNZWZLWEk0VVVSN1Y2c3V5YkE9PSIsInZhbHVlIjoiNktrMTJ4WXZ0ci9BTTNack5yQnY5YmVPMlc4cGt1N1JFR2U1VUh0M05Hdz0iLCJtYWMiOiJhMTEyOWFlOWZhNWNkZTdhMGM1ODc2YTk5N2ZkMGY4ODEyMzRkYTY5NmNhZGM1NmU0YjZhZDQ0ZjM3OWQzOWIwIiwidGFnIjoiIn0=', 'eyJpdiI6IlZXOVdSenhVUFhvY3VBV3pxNklQbWc9PSIsInZhbHVlIjoiaytzYTBZS3ZjNmw4U1BGZ2NkYTlOclpQTmRhWlB1TmhaN3dxWUoyUWgxdz0iLCJtYWMiOiJjMWM5NTM2NTEyZDZiYjA2ZmRhMjAzNWU2NzNiZTU1MTgxODQ4NmI2Y2RlMjBmMjc0NmYxNzZlYzBiZTFkZDM0IiwidGFnIjoiIn0=', NULL, 'eyJpdiI6InlTTEw2U1I0QVRVSVlJSUFLVTVZWmc9PSIsInZhbHVlIjoiUWFma0JWYVRQc0c0ODMzVTVNQ2JZUT09IiwibWFjIjoiNzNlNGZmZmUwNDFhNmMxYzVmZTk1OGM1Y2IwY2M3ZjgwNjJiZGU5YzUxNmJlN2ZlZTRlOTNiYjM5ZmNlMWZhMCIsInRhZyI6IiJ9', '2026-01-07 11:23:18', '2026-01-07 12:24:48'),
(3, 3, 'eyJpdiI6IklDNHpoMVNkck45MjdFT3NNVFhRVUE9PSIsInZhbHVlIjoiSnAxWUtaQWVzRHRoemYyRkkxY1Ntdz09IiwibWFjIjoiOTYyY2JkMjc1MjFkMWJkYTE4OTk3M2MxZmExZjRkNTZhM2E0ZWRkZTViMzFiZDMwOTRmOTJiNWMyNzc3NTYyZCIsInRhZyI6IiJ9', NULL, NULL, NULL, NULL, '2026-01-07 11:59:05'),
(6, 34, 'eyJpdiI6ImJRelN5Q2I4VEJmK3NHZTFkYmQ1c1E9PSIsInZhbHVlIjoibi9HUGhhNVJuRGdmTWM4dzRoNEV1QT09IiwibWFjIjoiMGJiOTExMTY3NmYyMGJiY2NkNWNkNWM0NzE4ZGYyOTI0MDc1Y2VlYzYzZDM5ZjU0YjFiNjY1MDdkNDVkMDZjMyIsInRhZyI6IiJ9', 'eyJpdiI6IlhDVXZLRS9zMi9GWXVuSmRCZFAxZEE9PSIsInZhbHVlIjoiT25PT3BYQkcyR0VUK0E5cnRUelF3QT09IiwibWFjIjoiZmI4YTkwNjliNWExZTE1NTY3OWJkOTE2M2UwOTZjY2Y0MWRlZjI4MzA3YWIzZGQzNGFhZDVkMGJhZGUxOWY0ZiIsInRhZyI6IiJ9', 'eyJpdiI6InBuOHdXZ0VLcjVhYmtuSDJ4WC9wa0E9PSIsInZhbHVlIjoiOUtZMmMya0J0ZnFiRlpaZ200WFlCQT09IiwibWFjIjoiNWJlMGI2ZDkwNDdjNTYzNDVhYmZiODRiMTVhZjczOWNjMTRlNmJiY2M5Nzc4N2VkNDE2MGZkNGUyNjI3ODVlOSIsInRhZyI6IiJ9', 'eyJpdiI6IjZNYzI0aThyZldzM3pNT1RNVlBKc2c9PSIsInZhbHVlIjoiVytrOGhHM1pLajNsRWpoTGpadjU0dz09IiwibWFjIjoiODE2ODk2ODNiNGQ1ZjU0OWE0MDlmNThhMDMyOWY2OGExYTUxNjFmNGUxYTZlNjg3NGUxMzQ2OTRkMzM2NzNiZCIsInRhZyI6IiJ9', '2026-01-14 11:28:44', '2026-01-14 11:28:44'),
(7, 35, 'eyJpdiI6IlYzZy9lUkt5eTR6dkVJZUVNUk9DMGc9PSIsInZhbHVlIjoiaGoya25KTXliQ3hjZXAwL0hTSFZ4UT09IiwibWFjIjoiNmI2ZTE2NzQ1ZmU3ODZkMzU5NWI3NWFmZWRjNTRjNzk4NDg2ZmJhZDhmZmM0Yzc4YjgwYWFjOTIzYjc4ZjEwMyIsInRhZyI6IiJ9', 'eyJpdiI6InZtWDRnVDdHMG4zTEdnYmVuUm9GR3c9PSIsInZhbHVlIjoiMTdKOVJHemZEUVRuTDVwb3dkVk9tUT09IiwibWFjIjoiZWIyZDIzNTQzYWNjYWQxYTgwMzQyZTVkZmMyN2QxNGJkNGE0NDAyMzk4ODIyMWRhYTdhZGQzNjJiOTgzY2Y1NSIsInRhZyI6IiJ9', 'eyJpdiI6IkNPd1ErK0N0SnlsRDc0dUdQZ3ZlaFE9PSIsInZhbHVlIjoibVNCbDN0WWVzNGV6U1hqbkRkUVdhUT09IiwibWFjIjoiODAwZTdiZDA0NzBlOGVmNGM0NGRmNDk4YjFlMjAwYTY5YWE3NTNmZTdhNWE1NDVjZmQwNTMxZTIyOGU3ZjUzMCIsInRhZyI6IiJ9', 'eyJpdiI6InVucityVkxtQlV1d1UzY3hTUUJXQlE9PSIsInZhbHVlIjoidlBFVnB2VUdpUnB2Nm9oTW1VdFpxZz09IiwibWFjIjoiNWVkMDc1OWQ5MzFiY2EwMGMxYmFjZTQ0ZWZlODQ3NzMwYzNhNDhiMDU2YWQ1NmU0ZTg2MGQxZTI0NzIzMzJkNiIsInRhZyI6IiJ9', '2026-01-14 11:31:24', '2026-01-14 11:31:24'),
(8, 36, 'eyJpdiI6Ilp1NkVsNEpST2k2dEVMc25PaDRTTUE9PSIsInZhbHVlIjoiVE5kSDFsK0s2Uytoa0crak1BQXY3UT09IiwibWFjIjoiNzk4NjBlYTZmMTA3NjM3NTE0NWNjMmExNTIyMWZhZTRlNzMzYTcwNTg5YTc5YTEzMTE3ZjE5YzdiMGVmNjczZCIsInRhZyI6IiJ9', 'eyJpdiI6Im5yMzhqc3FHMkpWRXZvb1AxSlhmSmc9PSIsInZhbHVlIjoiaWtLWnkwRzdVaXRBQ3BzWHhtUDNPdz09IiwibWFjIjoiYmM5MzBkYjMzZjc5MzMyZDhhZDM0NTlhYmVmMjFiNTRlMDVhODAwYWEwN2NjYWQ5YTlhNzY4YzM5MDUxYmM2NSIsInRhZyI6IiJ9', 'eyJpdiI6IkRyNmZFTTFWbnp3dXdpNnByV1pabnc9PSIsInZhbHVlIjoiSUFDb3IzZHVoeUZwcDlmaHJ4YXhGUT09IiwibWFjIjoiOTJjZDE4NDk1NmNjOTEwMjEwYzVmZGQ3MmFmNDIyZjY3MmY2MWQ0ZDc3ODZiMzNlY2VkMzAxODA2YzNmNTc0MiIsInRhZyI6IiJ9', 'eyJpdiI6ImUyVHhvSzYyQ1JtR3JkeDlFTTNsQ3c9PSIsInZhbHVlIjoiN2lHNHR0ZkpTdllNNS9FV2xOZ1VUdz09IiwibWFjIjoiMDQzOTA4MDQ4OGE1Y2RhYjU3YjlmNDUyYzcwY2Y5MzlhZDcxY2NjNjliODE1YWUzYzU5NWJjYzhiMDJjNWI3MCIsInRhZyI6IiJ9', '2026-01-14 11:33:16', '2026-01-14 11:33:16');

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
-- Struttura della tabella `firma_terapia`
--

CREATE TABLE `firma_terapia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firma_id` bigint(20) UNSIGNED NOT NULL,
  `terapia` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `firma_terapia`
--

INSERT INTO `firma_terapia` (`id`, `firma_id`, `terapia`) VALUES
(3, 2, 'fisioterapista'),
(4, 2, 'Oculista');

-- --------------------------------------------------------

--
-- Struttura della tabella `firma_terapista`
--

CREATE TABLE `firma_terapista` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firma_id` bigint(20) UNSIGNED NOT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `firma_terapista`
--

INSERT INTO `firma_terapista` (`id`, `firma_id`, `terapista_id`) VALUES
(1, 2, 2),
(2, 2, 21);

-- --------------------------------------------------------

--
-- Struttura della tabella `firme`
--

CREATE TABLE `firme` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `paziente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `terapia` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `terapista_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `firme`
--

INSERT INTO `firme` (`id`, `paziente_id`, `nome`, `cognome`, `data`, `terapia`, `note`, `terapista_id`, `created_at`, `updated_at`) VALUES
(1, 20, 'paziente', 'di test', '2026-01-14', 'logopedista', 'ciao', 21, '2026-01-14 12:29:14', '2026-01-14 12:29:14'),
(2, 20, 'paziente', 'di test', '2026-01-13', 'fisioterapista', NULL, 2, '2026-01-14 12:29:33', '2026-01-14 12:29:33'),
(3, 20, 'paziente', 'di test', '2026-01-12', 'fisioterapista', NULL, 5, '2026-01-14 12:29:52', '2026-01-14 12:29:52');

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
  `note` text DEFAULT NULL,
  `terapista_id` bigint(20) UNSIGNED DEFAULT NULL,
  `chiamato` tinyint(1) NOT NULL,
  `utente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `lista_attesa`
--

INSERT INTO `lista_attesa` (`id`, `nome`, `cognome`, `telefono`, `email`, `data`, `terapia`, `note`, `terapista_id`, `chiamato`, `utente_id`, `created_at`) VALUES
(4, 'Cecilia', 'Grasso', '46457567567', 'grassoceci@gmail.com', '2025-12-19', 'logopedista', NULL, 9, 0, 19, '2025-07-19 15:54:29'),
(5, 'Virginia', 'Lorenzi', NULL, 'casalorenzi@gmail.com', '2026-01-11', 'fisioterapista', 'può venire solamente la mattina', NULL, 0, 3, '2025-07-19 15:54:29');

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
(19, '2025_11_27_183607_add_fattura_to_pagamenti_table', 11),
(20, '2025_12_10_202411_create_notifiche_table', 12),
(21, '2025_12_10_202458_create_notifica_utente_table', 13),
(22, '2025_12_16_104311_create_system_flags_table', 14),
(23, '2025_12_16_114203_create_cartella_clinica_files_table', 15),
(24, '2025_12_20_181409_add_privacy_terms_to_utente_table', 16),
(25, '2025_12_20_183356_add_password_changed_at_to_utente_table', 17);

-- --------------------------------------------------------

--
-- Struttura della tabella `notifica_utente`
--

CREATE TABLE `notifica_utente` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `notifica_id` bigint(20) UNSIGNED NOT NULL,
  `utente_id` bigint(20) UNSIGNED NOT NULL,
  `letta` tinyint(1) NOT NULL DEFAULT 0,
  `letta_il` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `notifica_utente`
--

INSERT INTO `notifica_utente` (`id`, `notifica_id`, `utente_id`, `letta`, `letta_il`, `created_at`, `updated_at`) VALUES
(84, 15, 21, 1, '2026-01-19 10:08:46', '2026-01-19 10:08:06', '2026-01-19 10:08:06'),
(85, 16, 8, 1, '2026-01-19 10:09:01', '2026-01-19 10:08:41', '2026-01-19 10:08:41');

-- --------------------------------------------------------

--
-- Struttura della tabella `notifiche`
--

CREATE TABLE `notifiche` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `titolo` varchar(255) DEFAULT NULL,
  `messaggio` text NOT NULL,
  `tipologia` varchar(255) DEFAULT NULL,
  `urgenza` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `notifiche`
--

INSERT INTO `notifiche` (`id`, `admin_id`, `titolo`, `messaggio`, `tipologia`, `urgenza`, `created_at`, `updated_at`) VALUES
(15, 8, NULL, 'notifica di prova', NULL, NULL, '2026-01-19 10:08:06', '2026-01-19 10:08:06'),
(16, 21, NULL, 'il mio paziente non ha pagato oggi', NULL, NULL, '2026-01-19 10:08:41', '2026-01-19 10:08:41');

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
  `note` text DEFAULT NULL,
  `fattura` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT '2025-07-19 15:54:29'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `pagamenti`
--

INSERT INTO `pagamenti` (`id`, `paziente_id`, `nome`, `cognome`, `terapista_id`, `data`, `importo`, `note`, `fattura`, `created_at`) VALUES
(1, 20, NULL, NULL, 5, '2026-01-12', 60.00, NULL, 1, '2025-07-19 15:54:29'),
(2, 20, NULL, NULL, 2, '2026-01-13', 30.00, NULL, 0, '2025-07-19 15:54:29'),
(3, 20, NULL, NULL, 5, '2026-01-10', 40.00, NULL, 0, '2025-07-19 15:54:29');

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
(6, 19, 7, '2025-09-05', '2025-09-05 19:21:30', '2025-09-05 19:21:30'),
(7, 3, 21, '2025-12-07', '2025-12-07 10:49:22', '2025-12-07 10:49:22'),
(10, 3, 2, '2025-12-21', '2025-12-21 18:49:49', '2025-12-21 18:49:49'),
(12, 4, 7, '2025-12-21', '2025-12-21 19:03:46', '2025-12-21 19:03:46'),
(15, 27, 2, '2025-12-27', '2025-12-27 15:31:29', '2025-12-27 15:31:29'),
(16, 19, 21, '2026-01-02', '2026-01-02 16:14:13', '2026-01-02 16:14:13'),
(17, 19, 2, '2026-01-02', '2026-01-02 16:14:13', '2026-01-02 16:14:13'),
(18, 3, 6, '2026-01-02', '2026-01-02 17:32:55', '2026-01-02 17:32:55'),
(19, 19, 6, '2026-01-02', '2026-01-02 17:32:55', '2026-01-02 17:32:55'),
(22, 28, 21, '2026-01-06', '2026-01-06 17:02:59', '2026-01-06 17:02:59'),
(24, 30, 21, '2026-01-06', '2026-01-06 17:22:00', '2026-01-06 17:22:00'),
(28, 31, 21, '2026-01-07', '2026-01-07 12:24:48', '2026-01-07 12:24:48'),
(41, 20, 2, '2026-01-14', '2026-01-14 11:18:55', '2026-01-14 11:18:55'),
(42, 20, 21, '2026-01-14', '2026-01-14 11:18:55', '2026-01-14 11:18:55'),
(43, 20, 6, '2026-01-14', '2026-01-14 11:18:55', '2026-01-14 11:18:55'),
(45, 34, 2, '2026-01-14', '2026-01-14 11:28:44', '2026-01-14 11:28:44'),
(46, 34, 21, '2026-01-14', '2026-01-14 11:28:44', '2026-01-14 11:28:44'),
(47, 35, 2, '2026-01-14', '2026-01-14 11:31:24', '2026-01-14 11:31:24'),
(48, 36, 5, '2026-01-14', '2026-01-14 11:33:16', '2026-01-14 11:33:16'),
(49, 4, 5, '2026-01-15', '2026-01-15 10:06:40', '2026-01-15 10:06:40'),
(50, 20, 7, '2026-01-15', '2026-01-15 10:07:38', '2026-01-15 10:07:38'),
(51, 4, 9, '2026-01-19', '2026-01-19 10:11:44', '2026-01-19 10:11:44'),
(52, 3, 37, '2026-01-19', '2026-01-19 11:14:10', '2026-01-19 11:14:10');

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
(6, 9, 'Oculista'),
(7, 22, 'nuova professione'),
(11, 25, 'fisioterapista'),
(12, 37, 'Oculista');

-- --------------------------------------------------------

--
-- Struttura della tabella `system_flags`
--

CREATE TABLE `system_flags` (
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `system_flags`
--

INSERT INTO `system_flags` (`key`, `value`, `created_at`, `updated_at`) VALUES
('notifications_last_purge_at', '2026-01-15 11:05:59', '2025-12-16 09:59:08', '2026-01-15 10:05:59');

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
  `note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `tariffe`
--

INSERT INTO `tariffe` (`id`, `utente_id`, `terapia`, `prezzo`, `durata`, `note`, `created_at`, `updated_at`) VALUES
(7, 2, 'psichiatra', 35.00, 45, 'prima visita2', '2025-12-27 10:55:45', '2025-12-27 11:03:56');

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
  `email` varchar(255) DEFAULT NULL,
  `telefono_1` varchar(20) DEFAULT NULL,
  `telefono_2` varchar(20) DEFAULT NULL,
  `nascita` date DEFAULT NULL,
  `sesso` enum('M','F') DEFAULT NULL,
  `color_hex` char(7) DEFAULT NULL,
  `ruolo` varchar(255) NOT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `privacy_accepted_at` timestamp NULL DEFAULT NULL,
  `privacy_version` varchar(20) DEFAULT NULL,
  `terms_accepted_at` timestamp NULL DEFAULT NULL,
  `terms_version` varchar(20) DEFAULT NULL,
  `password_changed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`id`, `nome`, `cognome`, `username`, `password`, `email`, `telefono_1`, `telefono_2`, `nascita`, `sesso`, `color_hex`, `ruolo`, `is_blocked`, `privacy_accepted_at`, `privacy_version`, `terms_accepted_at`, `terms_version`, `password_changed_at`, `created_at`, `updated_at`) VALUES
(2, 'Carlo', 'De Maria', 'carlo.demaria', '$2y$12$BjGpfQDWCNt26Vkvm1cHbeNn1v/NBQ.j2DC1HFkiRXE5Ok9EBy1rG', 'demaria@gmail.com', '324354545', NULL, '1997-05-01', 'M', '#2563EB', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-19 14:01:17', '2025-09-05 19:16:55'),
(3, 'Virginia', 'Lorenzi', 'virginia.lorenzi', '$2y$12$87UDsS5GXg.SRMxxYm50A.7Mfpv3kQ1bcEMo9utapN.ufmHZRRz2G', 'casalorenzi@gmail.com', '44354353453', NULL, '2019-05-13', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-19 14:02:05', '2025-09-05 19:11:51'),
(4, 'Marco', 'Verdoni', 'marco.verdoni', '$2y$12$Z9c3Mp2xSp3t0xi2Vo9u/.bmvzolnpyZRy1um1Vi6lUusonzSBS7q', 'verdoni@outlook.it', '3454534534', NULL, '2021-09-03', NULL, NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-19 14:03:02', '2025-07-19 14:03:02'),
(5, 'Gabriele', 'Spina', 'gabriele.spina', '$2y$12$yKALrZLci/1kOCGXwPASxuApL141AL8mwcGwqH.anLinDJwRKmLKG', 'spinag@gmail.com', '432545345435', NULL, '1994-04-12', NULL, '#DC2626', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-20 07:47:53', '2025-07-20 07:47:53'),
(6, 'Veronica', 'Giustolisi', 'veronica.giustolisi', '$2y$12$/cMiFzT3xDt5uitaVV0yXOh37sfGlaBkhQmOv.Jm4MB9N65zdl7M.', 'giustolisidoc@gmail.com', '423423432', NULL, '1997-11-08', NULL, '#F59E0B', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-20 07:48:34', '2025-07-20 07:48:34'),
(7, 'Fabrizio', 'Veronesi', 'fabrizio.veronesi', '$2y$12$MgsABjeRn2C9.F0CkDXPpeqmC/2ImUpBi2F4jCBot2s4Zg3KDPI4O', 'veronesi@outlook.com', '234324324324', NULL, '1995-05-23', NULL, '#059669', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-07-20 07:49:58', '2025-07-20 07:49:58'),
(8, 'Amministratore', 'Sistema', 'admin', '$2y$12$h0ZdhExOZP4LhSy7RQoek.qS1GsoeFAnFDrvWLhmm3pjyKNXvwWCG', 'admin@example.com', '0000000000', '21654654864', '1990-01-01', NULL, NULL, 'admin', 0, '2025-12-20 17:58:08', 'v1.0', '2025-12-20 17:58:08', 'v1.0', '2025-12-30 12:08:29', '2025-08-11 15:43:41', '2025-12-30 12:08:29'),
(9, 'Domenico', 'Messina', 'domenico.messina', '$2y$12$3vZty2IMPeB1nxgCzZWlQ./GSWfANXhut9PqQ0t9/mcUGh2qJsSzm', 'domenicomess@gmail.com', '39283453113', NULL, '1995-04-01', NULL, '#7C3AED', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-08-24 15:53:36', '2025-08-24 15:53:36'),
(19, 'Cecilia', 'Grasso', 'cecilia.grasso', '$2y$12$08Pi3u0cSSuYAUUd9UUA5.5XZeYPGJDNLTVO7dWbdVBQBv37207Am', 'grassoceci@gmail.com', '46457567567', NULL, '2025-08-24', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-08-24 16:35:42', '2025-08-24 16:35:42'),
(20, 'paziente', 'di test', 'pazienteTest', '$2y$12$Z3uDhHIzMbZD8ZH3d/Xtie5TfWIlNLQgr4XM/FV/d1IHfDYRbv1zC', 'pazientetest@gmail.com', '3641247964', '216514654654', '2018-12-11', 'F', NULL, 'paziente', 0, '2025-12-20 18:18:20', 'v1.0', '2025-12-20 18:18:20', 'v1.0', '2026-01-12 19:18:12', '2025-12-09 09:37:50', '2026-01-14 11:18:55'),
(21, 'staff', 'di test', 'staffTest', '$2y$12$TLpzzUb1KLZ39he5mNriwuqZ/L5bpRERIs.SpUmXGquuqB0uMbp1K', 'staffditest@gmail.com', '3659842124', NULL, '2015-12-02', 'F', '#0EA5E9', 'staff', 0, '2025-12-20 18:19:41', 'v1.0', '2025-12-20 18:19:41', 'v1.0', '2025-12-20 18:19:55', NULL, '2025-12-20 18:19:55'),
(22, 'ciccio', 'bomba', 'ciccio.bomba', '$2y$12$ybXBRMfYgK/DTzJFCgOXMOzZjEQN95ay1DN30S8bnEULspYa2rh0S', 'dfsdfsdfsd@gmail.com', '453453453453', NULL, '2025-12-24', 'F', '#16A34A', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-12-24 15:31:49', '2025-12-24 15:31:49'),
(23, 'ciccio', 'bomba', 'ciccio.bomba1', '$2y$12$vfno8kRvyjSTR42x/RxRH.abs2SmhQOW0btIInNzAdYd90UAoG7VC', NULL, '05164564981', NULL, '2025-12-27', 'M', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-12-27 10:36:15', '2025-12-27 10:36:15'),
(24, 'nuovo', 'utente', 'nuovo.utente', '$2y$12$60qIHB46CAquQJHRG5ODe.DHSJAyR1X1qvQb8dvF6lvemgkKMUrRy', NULL, '036468495421', '31651564984', '2025-12-27', 'F', NULL, 'paziente', 0, '2025-12-30 12:06:38', 'v1.0', '2025-12-30 12:06:38', 'v1.0', '2025-12-30 12:07:52', '2025-12-27 10:47:55', '2025-12-30 12:07:52'),
(25, 'emma', 'cannavo', 'emma.cannavo', '$2y$12$fX3HSIoZ3F9ivtfF6xLQ7OEJ10ry1i3OM0ByDGrWDcPQna9Oy1ove', NULL, '6546453456', NULL, '2025-12-27', 'F', '#EA580C', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2025-12-27 12:04:15', '2025-12-27 12:04:15'),
(26, 'mattia', 'grasso', 'mattia.grasso', '$2y$12$hSLcIZDnsD4R.RmJf58N..EoPEoyhtklDLono4WTmbwM2kWJ0AtzW', NULL, NULL, NULL, '2025-12-27', 'M', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-12-27 15:19:42', '2025-12-27 15:19:42'),
(27, 'alice', 'romano', 'alice.romano', '$2y$12$OeMrF92oRwYkxmM5yU.JN.ZA74fFdmS.LIp4aKZejTv.Ug/if7.hi', NULL, '234564861', NULL, '2025-12-27', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2025-12-27 15:31:13', '2025-12-27 15:31:13'),
(28, 'paziente', 'stanco', 'paziente.stanco', '$2y$12$dCodMiW58D9wEMm7wjufJO19V3egczKmubsHHhVkqz9/0nulkCkMu', NULL, '5978213121', NULL, '2026-01-06', 'M', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-06 16:54:52', '2026-01-06 16:54:52'),
(29, 'altro', 'paziente', 'altro.paziente', '$2y$12$TEbyqnQJggC4v5a6ETu.LuKMOiqmgTIJjBWnsBS98zRRSGrSHfe1G', NULL, '654654984', NULL, '2026-01-06', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-06 17:03:51', '2026-01-06 17:03:51'),
(30, 'giovanni', 'palesi', 'giovanni.palesi', '$2y$12$66gVwq0tlek26jHl4p0cQu/DJe5kvQV/XNMhA6fCYp1tm1LGT/r6W', NULL, '45345435345', NULL, '2026-01-06', 'M', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-06 17:22:00', '2026-01-06 17:22:00'),
(31, 'gianfranco', 'merlino', 'gianfranco.merlino', '$2y$12$KZS9XsH.jzXBrlIiax8wQOv8Hx1TBun3d91PpdYrl7VW6VlGeRhFK', NULL, '45324534534', NULL, '2026-01-07', 'M', NULL, 'paziente', 0, '2026-01-07 11:23:47', 'v1.0', '2026-01-07 11:23:47', 'v1.0', '2026-01-07 11:24:05', '2026-01-07 11:23:18', '2026-01-07 11:24:05'),
(32, 'vera', 'salemi', 'vera.salemi', '$2y$12$rvNEUG/ID2hnEGrh9ujtku.ls9ayuvyOC8yGpt5PPW3Ve5VRvc3vO', NULL, '1263516531', '16515612113', '2026-01-07', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-07 11:54:46', '2026-01-07 11:54:46'),
(33, 'nuovo', 'paziente', 'nuovo.paziente', '$2y$12$PVy5DWaUUYU7lgMEXX4W/eAKFRPbVkM55zblsT32ETqUapsuFNvIm', NULL, '5345345345', '452e3242', '2026-01-14', 'F', NULL, 'paziente', 0, '2026-01-14 11:22:16', 'v1.0', '2026-01-14 11:22:16', 'v1.0', '2026-01-14 11:22:29', '2026-01-14 11:21:49', '2026-01-14 11:22:29'),
(34, 'ciao', 'ciao', 'ciao.ciao', '$2y$12$b.d96MmPmFj5OiDhgGTWgeNwMOVSQhbwLlOPS2LzPgNGC3N57syUu', NULL, '453454', '56556767', '2026-01-14', 'F', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-14 11:28:44', '2026-01-14 11:28:44'),
(35, 'ciao', 'amico', 'ciao.amico', '$2y$12$3A/WxUk5vulwC.Lag0.XoeC1hTXwl17b9qWaLb419OgSlgHPJWpC2', NULL, '435345', '54353453453', '2026-01-14', 'M', NULL, 'paziente', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-14 11:31:24', '2026-01-14 11:31:24'),
(36, 'ciao', 'emma', 'ciao.emma', '$2y$12$wFobweTXp0khJWZE5TBWf.R0sIsk99Siu8sKjg74nSqlEZV4t7vp2', NULL, '454534543', '24323242', '2026-01-14', 'F', NULL, 'paziente', 1, NULL, NULL, NULL, NULL, NULL, '2026-01-14 11:33:16', '2026-01-14 11:33:16'),
(37, 'nuovo', 'staff', 'nuovo.staff', '$2y$12$xROWLWdV3p972DZ4nL9NWOjfhVzBzoXnNcz2SStORo.th05tkqx9K', NULL, '325345345', '564656675', '2026-01-19', 'F', '#9333EA', 'staff', 0, NULL, NULL, NULL, NULL, NULL, '2026-01-19 11:13:35', '2026-01-19 11:13:35');

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
-- Indici per le tabelle `appuntamento_paziente`
--
ALTER TABLE `appuntamento_paziente`
  ADD PRIMARY KEY (`appuntamento_id`,`paziente_id`),
  ADD KEY `idx_ap_paziente_paziente_id` (`paziente_id`);

--
-- Indici per le tabelle `appuntamento_terapista`
--
ALTER TABLE `appuntamento_terapista`
  ADD PRIMARY KEY (`appuntamento_id`,`terapista_id`),
  ADD KEY `idx_ap_terapista_terapista_id` (`terapista_id`);

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
-- Indici per le tabelle `cartella_clinica_files`
--
ALTER TABLE `cartella_clinica_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cartella_clinica_files_paziente_id_foreign` (`paziente_id`),
  ADD KEY `cartella_clinica_files_uploaded_by_foreign` (`uploaded_by`);

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
-- Indici per le tabelle `firma_terapia`
--
ALTER TABLE `firma_terapia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_firma_terapia_firma` (`firma_id`);

--
-- Indici per le tabelle `firma_terapista`
--
ALTER TABLE `firma_terapista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_firma_terapista` (`firma_id`,`terapista_id`),
  ADD KEY `fk_firma_terapista_utente` (`terapista_id`);

--
-- Indici per le tabelle `firme`
--
ALTER TABLE `firme`
  ADD PRIMARY KEY (`id`),
  ADD KEY `firme_terapista_id_foreign` (`terapista_id`),
  ADD KEY `firme_paziente_id_index` (`paziente_id`);

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
-- Indici per le tabelle `notifica_utente`
--
ALTER TABLE `notifica_utente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifica_utente_notifica_id_foreign` (`notifica_id`),
  ADD KEY `notifica_utente_utente_id_foreign` (`utente_id`);

--
-- Indici per le tabelle `notifiche`
--
ALTER TABLE `notifiche`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifiche_admin_id_foreign` (`admin_id`);

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
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `system_flags`
--
ALTER TABLE `system_flags`
  ADD PRIMARY KEY (`key`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT per la tabella `cartella_clinica_files`
--
ALTER TABLE `cartella_clinica_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `cartelle_cliniche`
--
ALTER TABLE `cartelle_cliniche`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT per la tabella `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `firma_terapia`
--
ALTER TABLE `firma_terapia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `firma_terapista`
--
ALTER TABLE `firma_terapista`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `firme`
--
ALTER TABLE `firme`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `lista_attesa`
--
ALTER TABLE `lista_attesa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT per la tabella `notifica_utente`
--
ALTER TABLE `notifica_utente`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT per la tabella `notifiche`
--
ALTER TABLE `notifiche`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT per la tabella `pagamenti`
--
ALTER TABLE `pagamenti`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `pazienti_terapisti`
--
ALTER TABLE `pazienti_terapisti`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT per la tabella `staff_dati`
--
ALTER TABLE `staff_dati`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT per la tabella `tariffe`
--
ALTER TABLE `tariffe`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

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
-- Limiti per la tabella `appuntamento_paziente`
--
ALTER TABLE `appuntamento_paziente`
  ADD CONSTRAINT `fk_ap_paziente_appuntamento` FOREIGN KEY (`appuntamento_id`) REFERENCES `appuntamenti` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ap_paziente_utente` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `appuntamento_terapista`
--
ALTER TABLE `appuntamento_terapista`
  ADD CONSTRAINT `fk_ap_terapista_appuntamento` FOREIGN KEY (`appuntamento_id`) REFERENCES `appuntamenti` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ap_terapista_utente` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limiti per la tabella `cartella_clinica_files`
--
ALTER TABLE `cartella_clinica_files`
  ADD CONSTRAINT `cartella_clinica_files_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartella_clinica_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `cartelle_cliniche`
--
ALTER TABLE `cartelle_cliniche`
  ADD CONSTRAINT `cartelle_cliniche_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `firma_terapia`
--
ALTER TABLE `firma_terapia`
  ADD CONSTRAINT `fk_firma_terapia_firma` FOREIGN KEY (`firma_id`) REFERENCES `firme` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `firma_terapista`
--
ALTER TABLE `firma_terapista`
  ADD CONSTRAINT `fk_firma_terapista_firma` FOREIGN KEY (`firma_id`) REFERENCES `firme` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_firma_terapista_utente` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `firme`
--
ALTER TABLE `firme`
  ADD CONSTRAINT `firme_paziente_id_foreign` FOREIGN KEY (`paziente_id`) REFERENCES `utente` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `firme_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `lista_attesa`
--
ALTER TABLE `lista_attesa`
  ADD CONSTRAINT `lista_attesa_terapista_id_foreign` FOREIGN KEY (`terapista_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lista_attesa_utente_id_foreign` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`) ON DELETE SET NULL;

--
-- Limiti per la tabella `notifica_utente`
--
ALTER TABLE `notifica_utente`
  ADD CONSTRAINT `notifica_utente_notifica_id_foreign` FOREIGN KEY (`notifica_id`) REFERENCES `notifiche` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifica_utente_utente_id_foreign` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `notifiche`
--
ALTER TABLE `notifiche`
  ADD CONSTRAINT `notifiche_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `utente` (`id`) ON DELETE CASCADE;

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
