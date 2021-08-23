-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 15, 2021 at 03:13 PM
-- Server version: 5.7.11
-- PHP Version: 5.6.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scol_admin`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_affectation`
--

CREATE TABLE `tb_affectation` (
  `id` bigint(20) NOT NULL,
  `id_personne` bigint(20) NOT NULL,
  `niveau` int(11) NOT NULL,
  `classroom` int(11) NOT NULL,
  `options` varchar(50) DEFAULT NULL,
  `aneaca` varchar(100) NOT NULL,
  `acteur` varchar(100) DEFAULT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_affectation`
--

INSERT INTO `tb_affectation` (`id`, `id_personne`, `niveau`, `classroom`, `options`, `aneaca`, `acteur`, `date_time`) VALUES
(1, 5, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-02 21:38:45'),
(2, 6, 2, 43, NULL, '2019-2020', 'keromain', '2021-01-02 21:47:12'),
(3, 7, 3, 46, NULL, '2020-2021', 'keromain', '2021-01-03 20:21:20'),
(4, 8, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-03 20:50:23'),
(5, 9, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-03 20:52:27'),
(6, 10, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-03 21:02:22'),
(8, 12, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-03 21:02:57'),
(9, 13, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-03 21:03:06'),
(10, 15, 1, 42, NULL, '2020-2021', 'keromain', '2021-01-07 09:25:06'),
(11, 16, 6, 47, NULL, '2020-2021', 'keromain', '2021-01-08 09:01:33'),
(12, 17, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:49:16'),
(13, 18, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:51:24'),
(14, 19, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:51:41'),
(15, 20, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:51:57'),
(16, 21, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:52:23'),
(17, 22, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:52:44'),
(18, 23, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:52:58'),
(19, 24, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:53:09'),
(20, 25, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:53:24'),
(21, 26, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:53:39'),
(22, 27, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:54:04'),
(23, 28, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:54:27'),
(24, 29, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:56:37'),
(25, 30, 7, 45, NULL, '2020-2021', 'keromain', '2021-01-15 10:56:48');

-- --------------------------------------------------------

--
-- Table structure for table `tb_categorie_cours`
--

CREATE TABLE `tb_categorie_cours` (
  `id` int(11) NOT NULL,
  `categorie` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_categorie_cours`
--

INSERT INTO `tb_categorie_cours` (`id`, `categorie`) VALUES
(4, 'Autres'),
(1, 'Histoire'),
(2, 'Langue'),
(3, 'Mathematiques');

-- --------------------------------------------------------

--
-- Table structure for table `tb_classes`
--

CREATE TABLE `tb_classes` (
  `id` int(11) NOT NULL,
  `mere` int(11) NOT NULL,
  `classe` varchar(200) NOT NULL,
  `abv` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_classes`
--

INSERT INTO `tb_classes` (`id`, `mere`, `classe`, `abv`) VALUES
(1, 0, '1Ã¨re AnnÃ©e Fondamentale', '1AF'),
(2, 0, '2Ã¨me AnnÃ©e Fondamentale', '2AF'),
(3, 0, '3Ã¨me AnnÃ©e Fondamentale', '3AF'),
(4, 0, '4Ã¨me AnnÃ©e Fondamentale', '4AF'),
(5, 0, '5Ã¨me AnnÃ©e Fondamentale', '5AF'),
(6, 0, '6Ã¨me AnnÃ©e Fondamentale', '6AF'),
(7, 0, '7Ã¨me AnnÃ©e Fondamentale', '7AF'),
(8, 0, '8Ã¨me AnnÃ©e Fondamentale', '8AF'),
(9, 0, '9Ã¨me AnnÃ©e Fondamentale', '9AF'),
(10, 0, 'Nouveau Secondaire I', 'NS1'),
(11, 0, 'Nouveau Secondaire II', 'NS2'),
(12, 0, 'Nouveau Secondaire III', 'NS3'),
(13, 0, 'Philo', 'Philo'),
(42, 1, '1Ã¨re AnnÃ©e Fondamentale', '1Ã¨AF'),
(43, 2, '2Ã¨me AnnÃ©e Fondamentale', '2Ã¨AF'),
(44, 0, '7Ã¨me AnnÃ©e Fondamentale A', '7Ã¨AF A'),
(45, 7, '7Ã¨me AnnÃ©e Fondamentale A', '7Ã¨AF A'),
(46, 3, '3Ã¨me AnnÃ©e Fondamentale', '3eme AF'),
(47, 6, '6Ã¨me AnnÃ©e Fondamentale', '6Ã¨AF A');

-- --------------------------------------------------------

--
-- Table structure for table `tb_cours`
--

CREATE TABLE `tb_cours` (
  `id` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `categorie` int(11) NOT NULL DEFAULT '0',
  `type` varchar(15) DEFAULT NULL,
  `tp` int(11) NOT NULL DEFAULT '0',
  `session` varchar(30) DEFAULT NULL,
  `niveau` int(11) DEFAULT '0',
  `options` int(11) DEFAULT NULL,
  `coef` int(11) DEFAULT NULL,
  `poids` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_cours`
--

INSERT INTO `tb_cours` (`id`, `libelle`, `code`, `categorie`, `type`, `tp`, `session`, `niveau`, `options`, `coef`, `poids`) VALUES
(1, 'Sciences Religieuses', 'SR', 0, '0', 0, '0', 0, 0, 0, 1),
(2, 'Latin', 'LAT', 0, '0', 0, '0', 0, 0, 0, 1),
(3, 'Grammaire', 'GR', 0, '0', 0, '0', 0, 0, 0, 1),
(4, 'Texte ExpliquÃ©', 'TE', 0, '0', 0, '0', 0, 0, 0, 1),
(5, 'Production Ecrite', 'PE', 0, '0', 0, '0', 0, 0, 0, 1),
(6, 'PiÃ¨ce Classique / Fables', 'PC', 0, 'Simple', 0, '0', 0, 1, 0, 1),
(7, 'Technique d\'expression', 'TEX', 0, '0', 0, '0', 0, 0, 0, 1),
(8, 'AlgÃ¨bre', 'Al', 1, '0', 0, '0', 0, 0, 0, 1),
(9, 'GÃ©omÃ©trie', 'GEO', 0, '0', 0, '0', 0, 0, 0, 1),
(10, 'Physique', 'PH', 0, '0', 0, '0', 0, 0, 0, 1),
(11, 'Biologie', 'BIO', 0, '0', 0, '0', 0, 0, 0, 1),
(12, 'Sciences Naturelles', 'SCN', 0, '0', 0, '0', 0, 0, 0, 1),
(13, 'Communication CrÃ©ole', 'CCR', 0, '0', 0, '0', 0, 0, 0, 1),
(14, 'Anglais', 'AN', 0, '0', 0, '0', 0, 0, 0, 1),
(15, 'Espagnol', 'ES', 0, '0', 0, '0', 0, 0, 0, 1),
(16, 'Sciences Sociales', 'SS', 0, '0', 0, '0', 0, 0, 0, 1),
(17, 'Informatique', 'INFO', 0, '0', 0, '0', 0, 0, 0, 1),
(18, 'Art Plastique', 'APL', 0, '0', 0, '0', 0, 0, 0, 1),
(19, 'Vie Scolaire / Formation Humaine', 'VS', 0, '0', 0, '0', 0, 0, 0, 1),
(20, 'Composition LittÃ©raire', 'CL', 0, '0', 0, '0', 0, 0, 0, 1),
(21, 'FranÃ§ais', 'FR', 0, '0', 0, '0', 0, 0, 0, 1),
(22, 'CrÃ©ole', 'CR', 0, '0', 0, '0', 0, 0, 0, 1),
(23, 'AlgÃ¨bre / Analyse', 'ALA', 2, '0', 0, '0', 0, 0, 0, 1),
(24, 'TrigonomÃ©trie / Analyse Combinatoire', 'TRAN', 0, '0', 0, '0', 0, 0, 0, 1),
(25, 'Physique / Optique', 'PHO', 0, '0', 0, '0', 0, 0, 0, 1),
(26, 'Chimie', 'CH', 0, '0', 0, '0', 0, 0, 0, 1),
(27, 'Education Ã  la CitoyennetÃ©', 'EC', 0, '0', 0, '0', 0, 0, 0, 1),
(28, 'Bio-gÃ©o-physiologie (SVT)', 'SVT', 0, '0', 0, '0', 0, 0, 0, 1),
(29, 'Histoire-GÃ©ographie', 'HG', 0, '0', 0, '0', 0, 0, 0, 1),
(30, 'Introduction Ã  l\'Ã©conomie', 'IE', 0, '0', 0, '0', 0, 0, 0, 1),
(31, 'Education Artistique et EsthÃ©tique', 'EAE', 0, '0', 0, '0', 0, 0, 0, 1),
(32, 'Education Physique et Sport', 'EPS', 0, '0', 0, '0', 0, 0, 0, 1),
(33, 'Tech-Diss Philosophie', 'TDP', 0, '0', 0, '0', 0, 0, 0, 1),
(34, 'Philosophie / Psychologie', 'PHP', 0, '0', 0, '0', 0, 0, 0, 1),
(35, 'Morale', 'MR', 0, '0', 0, '0', 0, 0, 0, 1),
(36, 'Logique', 'LOG', 0, '0', 0, '0', 0, 0, 0, 1),
(37, 'AlgÃ¨bre / GÃ©omÃ©trie', 'ALG', 2, '0', 0, '0', 0, 0, 0, 1),
(38, 'Analyse / ProbabilitÃ©', 'APR', 0, '0', 0, '0', 0, 0, 0, 1),
(39, 'Suite / Complexe', 'SCP', 0, '0', 0, '0', 0, 0, 0, 1),
(40, 'Connaissances GÃ©nÃ©rales', 'CG', 0, '0', 0, '0', 0, 0, 0, 1),
(41, 'Sciences Religieuses', 'SR-7', 0, 'Simple', 0, 'All', 7, 1, 10, 1),
(42, 'Latin', 'LAT-7', 0, 'Simple', 0, 'All', 7, 1, 20, 2),
(43, 'Grammaire', 'GR-7', 0, 'Simple', 0, 'All', 7, 1, 20, 3),
(44, 'Texte ExpliquÃ©', 'TE-7', 0, 'Simple', 0, 'All', 7, 1, 30, 4),
(45, 'Production Ecrite', 'PE-7', 0, 'Simple', 0, 'All', 7, 1, 10, 5),
(46, 'PiÃ¨ce Classique / Fables', 'PC-7', 0, 'Simple', 0, 'All', 7, 1, 20, 6),
(47, 'AlgÃ¨bre', 'AL-7', 0, 'Simple', 0, 'All', 7, 1, 40, 7),
(48, 'GÃ©omÃ©trie', 'GEO-7', 0, 'Simple', 0, 'All', 7, 1, 30, 8),
(49, 'Physique', 'PH-7', 0, 'Simple', 0, 'All', 7, 1, 20, 9),
(50, 'Sciences Naturelles', 'SCN-7', 0, 'Simple', 0, 'All', 7, 1, 20, 10),
(51, 'Communication CrÃ©ole', 'CCR-7', 0, 'Simple', 0, 'All', 7, 1, 20, 11),
(52, 'Anglais', 'AN-7', 0, 'Simple', 0, 'All', 7, 1, 20, 12),
(53, 'Espagnol', 'ES-7', 0, 'Simple', 0, 'All', 7, 1, 20, 13),
(54, 'Sciences Sociales', 'SS-7', 0, 'Simple', 0, 'All', 7, 1, 30, 14),
(55, 'Informatique', 'INFO-7', 0, 'Simple', 0, 'All', 7, 1, 20, 15),
(56, 'Art Plastique', 'APL-7', 0, 'Simple', 0, 'All', 7, 1, 10, 16),
(57, 'Vie Scolaire / Formation Humaine', 'VS-7', 0, 'Simple', 0, 'All', 7, 1, 20, 17),
(58, 'Sciences Religieuses', 'SR-8', 0, 'Simple', 0, 'All', 8, 1, 10, 1),
(59, 'Latin', 'LAT-8', 0, 'Simple', 0, 'All', 8, 1, 10, 2),
(60, 'Grammaire', 'GR-8', 0, 'Simple', 0, 'All', 8, 1, 20, 3),
(61, 'Texte ExpliquÃ©', 'TE-8', 0, 'Simple', 0, 'All', 8, 1, 20, 4),
(62, 'Production Ecrite', 'PE-8', 0, 'Simple', 0, 'All', 8, 1, 20, 5),
(63, 'PiÃ¨ce Classique / Fables', 'PC-8', 0, 'Simple', 0, 'All', 8, 1, 10, 6),
(64, 'AlgÃ¨bre', 'AL-8', 0, 'Simple', 0, 'All', 8, 1, 40, 7),
(65, 'GÃ©omÃ©trie', 'GEO-8', 0, 'Simple', 0, 'All', 8, 1, 30, 8),
(66, 'Physique', 'PH-8', 0, 'Simple', 0, 'All', 8, 1, 20, 9),
(67, 'Biologie', 'BIO-8', 0, 'Simple', 0, 'All', 8, 1, 20, 10),
(68, 'Sciences Naturelles', 'SCN-8', 0, 'Simple', 0, 'All', 8, 1, 20, 11),
(69, 'Communication CrÃ©ole', 'CCR-8', 0, 'Simple', 0, 'All', 8, 1, 20, 12),
(70, 'Anglais', 'AN-8', 0, 'Simple', 0, 'All', 8, 1, 20, 13),
(71, 'Espagnol', 'ES-8', 0, 'Simple', 0, 'All', 8, 1, 20, 14),
(72, 'Sciences Sociales', 'SS-8', 0, 'Simple', 0, 'All', 8, 1, 30, 15),
(73, 'Informatique', 'INFO-8', 0, 'Simple', 0, 'All', 8, 1, 20, 16),
(74, 'Art Plastique', 'APL-8', 0, 'Simple', 0, 'All', 8, 1, 10, 17),
(75, 'Vie Scolaire / Formation Humaine', 'VS-8', 0, 'Simple', 0, 'All', 8, 1, 20, 18),
(76, 'Sciences Religieuses', 'SR-9', 0, 'Simple', 0, 'All', 9, 1, 10, 1),
(77, 'Grammaire', 'GR-9', 0, 'Simple', 0, 'All', 9, 1, 20, 2),
(78, 'Texte ExpliquÃ©', 'TE-9', 0, 'Simple', 0, 'All', 9, 1, 20, 3),
(79, 'Production Ecrite', 'PE-9', 0, 'Simple', 0, 'All', 9, 1, 10, 4),
(80, 'PiÃ¨ce Classique / Fables', 'PC-9', 0, 'Simple', 0, 'All', 9, 1, 10, 5),
(81, 'Technique d expression', 'TEX-9', 0, 'Simple', 0, 'All', 9, 1, 20, 6),
(82, 'AlgÃ¨bre', 'AL-9', 0, 'Simple', 0, 'All', 9, 1, 40, 7),
(83, 'GÃ©omÃ©trie', 'GEO-9', 0, 'Simple', 0, 'All', 9, 1, 30, 8),
(84, 'Physique', 'PH-9', 0, 'Simple', 0, 'All', 9, 1, 20, 9),
(85, 'Biologie', 'BIO-9', 0, 'Simple', 0, 'All', 9, 1, 20, 10),
(86, 'Sciences Naturelles', 'SCN-9', 0, 'Simple', 0, 'All', 9, 1, 20, 11),
(87, 'Communication CrÃ©ole', 'CCR-9', 0, 'Simple', 0, 'All', 9, 1, 20, 12),
(88, 'Anglais', 'AN-9', 0, 'Simple', 0, 'All', 9, 1, 20, 13),
(89, 'Espagnol', 'ES-9', 0, 'Simple', 0, 'All', 9, 1, 20, 14),
(90, 'Sciences Sociales', 'SS-9', 0, 'Simple', 0, 'All', 9, 1, 30, 15),
(91, 'Informatique', 'INFO-9', 0, 'Simple', 0, 'All', 9, 1, 20, 16),
(92, 'Art Plastique', 'APL-9', 0, 'Simple', 0, 'All', 9, 1, 10, 17),
(93, 'Vie Scolaire / Formation Humaine', 'VS-9', 0, 'Simple', 0, 'All', 9, 1, 20, 18),
(94, 'Sciences Religieuses', 'SR-10', 0, 'Simple', 0, 'All', 10, 1, 10, 1),
(95, 'Composition LittÃ©raire', 'CL-10', 0, 'Simple', 0, 'All', 10, 1, 20, 2),
(96, 'FranÃ§ais', 'FR-10', 0, 'Simple', 0, 'All', 10, 1, 40, 3),
(97, 'CrÃ©ole', 'CR-10', 0, 'Simple', 0, 'All', 10, 1, 20, 4),
(98, 'Anglais', 'AN-10', 0, 'Simple', 0, 'All', 10, 1, 20, 5),
(99, 'Espagnol', 'ES-10', 0, 'Simple', 0, 'All', 10, 1, 20, 6),
(100, 'AlgÃ¨bre / Analyse', 'ALA-10', 0, 'Simple', 0, 'All', 10, 1, 40, 7),
(101, 'GÃ©omÃ©trie', 'GEO-10', 0, 'Simple', 0, 'All', 10, 1, 30, 8),
(102, 'TrigonomÃ©trie / Analyse Combinatoire', 'TRAN-10', 0, 'Simple', 0, 'All', 10, 1, 10, 9),
(103, 'Physique / Optique', 'PHO-10', 0, 'Simple', 0, 'All', 10, 1, 30, 11),
(104, 'Chimie', 'CH-10', 0, 'Simple', 0, 'All', 10, 1, 30, 10),
(105, 'Education Ã  la CitoyennetÃ©', 'EC-10', 0, 'Simple', 0, 'All', 10, 1, 10, 12),
(106, 'Bio-gÃ©o-physiologie (SVT)', 'SVT-10', 0, 'Simple', 0, 'All', 10, 1, 30, 13),
(107, 'Histoire-GÃ©ographie', 'HG-10', 0, 'Simple', 0, 'All', 10, 1, 20, 14),
(108, 'Informatique', 'INFO-10', 0, 'Simple', 0, 'All', 10, 1, 20, 15),
(109, 'Introduction Ã  l Ã©conomie', 'IE-10', 0, 'Simple', 0, 'All', 10, 1, 10, 16),
(110, 'Education Artistique et EsthÃ©tique', 'EAE-10', 0, 'Simple', 0, 'All', 10, 1, 10, 18),
(111, 'Education Physique et Sport', 'EPS-10', 0, 'Simple', 0, 'All', 10, 1, 10, 17),
(112, 'Vie Scolaire / Formation Humaine', 'VS-10', 0, 'Simple', 0, 'All', 10, 1, 20, 19),
(113, 'Sciences Religieuses', 'SR-13', 0, 'Simple', 0, 'All', 13, 1, 10, 1),
(114, 'Tech-Diss Philosophie', 'TDP-13', 0, 'Simple', 0, 'All', 13, 1, 10, 2),
(115, 'Philosophie / Psychologie', 'PHP-13', 0, 'Simple', 0, 'All', 13, 1, 10, 3),
(116, 'Morale', 'MR-13', 0, 'Simple', 0, 'All', 13, 1, 20, 4),
(117, 'Logique', 'LOG-13', 0, 'Simple', 0, 'All', 13, 1, 20, 5),
(118, 'Anglais', 'AN-13', 0, 'Simple', 0, 'All', 13, 1, 20, 7),
(119, 'Espagnol', 'ES-13', 0, 'Simple', 0, 'All', 13, 1, 20, 8),
(120, 'AlgÃ¨bre / GÃ©omÃ©trie', 'ALG-13', 0, 'Simple', 0, 'All', 13, 1, 40, 9),
(121, 'Analyse / ProbabilitÃ©', 'APR-13', 0, 'Simple', 0, 'All', 13, 1, 30, 10),
(122, 'Suite / Complexe', 'SCP-13', 0, 'Simple', 0, 'All', 13, 1, 30, 11),
(123, 'Physique', 'PH-13', 0, 'Simple', 0, 'All', 13, 1, 30, 12),
(124, 'Chimie', 'CH-13', 0, 'Simple', 0, 'All', 13, 1, 20, 13),
(125, 'Biologie', 'BIO-13', 0, 'Simple', 0, 'All', 13, 1, 20, 14),
(126, 'Sciences Sociales', 'SS-13', 0, 'Simple', 0, 'All', 13, 1, 30, 15),
(127, 'Informatique', 'INFO-13', 0, 'Simple', 0, 'All', 13, 1, 20, 16),
(128, 'Connaissances GÃ©nÃ©rales', 'CG-13', 0, 'Simple', 0, 'All', 13, 1, 10, 17),
(129, 'Vie Scolaire / Formation Humaine', 'VS-13', 0, 'Simple', 0, 'All', 13, 1, 20, 18),
(130, 'Sciences Religieuses', 'SR-11', 0, 'Simple', 0, 'All', 11, 1, 10, 1),
(131, 'Composition LittÃ©raire', 'CL-11', 0, 'Simple', 0, 'All', 11, 1, 20, 2),
(132, 'FranÃ§ais', 'FR-11', 0, 'Simple', 0, 'All', 11, 1, 40, 3),
(133, 'CrÃ©ole', 'CR-11', 0, 'Simple', 0, 'All', 11, 1, 20, 4),
(134, 'Anglais', 'AN-11', 0, 'Simple', 0, 'All', 11, 1, 20, 5),
(135, 'Espagnol', 'ES-11', 0, 'Simple', 0, 'All', 11, 1, 20, 6),
(136, 'AlgÃ¨bre / Analyse', 'ALA-11', 0, 'Simple', 0, 'All', 11, 1, 40, 7),
(137, 'GÃ©omÃ©trie', 'GEO-11', 0, 'Simple', 0, 'All', 11, 1, 30, 8),
(138, 'TrigonomÃ©trie / Analyse Combinatoire', 'TRAN-11', 0, 'Simple', 0, 'All', 11, 1, 10, 9),
(139, 'Physique / Optique', 'PHO-11', 0, 'Simple', 0, 'All', 11, 1, 30, 10),
(140, 'Chimie', 'CH-11', 0, 'Simple', 0, 'All', 11, 1, 30, 11),
(141, 'Education Ã  la CitoyennetÃ©', 'EC-11', 0, 'Simple', 0, 'All', 11, 1, 10, 12),
(142, 'Bio-gÃ©o-physiologie (SVT)', 'SVT-11', 0, 'Simple', 0, 'All', 11, 1, 30, 13),
(143, 'Histoire-GÃ©ographie', 'HG-11', 0, 'Simple', 0, 'All', 11, 1, 20, 14),
(144, 'Informatique', 'INFO-11', 0, 'Simple', 0, 'All', 11, 1, 20, 15),
(145, 'Introduction Ã  l Ã©conomie', 'IE-11', 0, 'Simple', 0, 'All', 11, 1, 10, 16),
(146, 'Education Artistique et EsthÃ©tique', 'EAE-11', 0, 'Simple', 0, 'All', 11, 1, 10, 17),
(147, 'Education Physique et Sport', 'EPS-11', 0, 'Simple', 0, 'All', 11, 1, 10, 18),
(148, 'Vie Scolaire / Formation Humaine', 'VS-11', 0, 'Simple', 0, 'All', 11, 1, 20, 19),
(149, 'Sciences Religieuses', 'SR-12', 0, 'Simple', 0, 'All', 12, 1, 10, 1),
(150, 'Composition LittÃ©raire', 'CL-12', 0, 'Simple', 0, 'All', 12, 1, 20, 2),
(151, 'FranÃ§ais', 'FR-12', 0, 'Simple', 0, 'All', 12, 1, 40, 3),
(152, 'CrÃ©ole', 'CR-12', 0, 'Simple', 0, 'All', 12, 1, 20, 4),
(153, 'Anglais', 'AN-12', 0, 'Simple', 0, 'All', 12, 1, 20, 5),
(154, 'Espagnol', 'ES-12', 0, 'Simple', 0, 'All', 12, 1, 20, 5),
(155, 'AlgÃ¨bre / Analyse', 'ALA-12', 0, 'Simple', 0, 'All', 12, 1, 40, 6),
(156, 'GÃ©omÃ©trie', 'GEO-12', 0, 'Simple', 0, 'All', 12, 1, 30, 7),
(157, 'TrigonomÃ©trie / Analyse Combinatoire', 'TRAN-12', 0, 'Simple', 0, 'All', 12, 1, 20, 8),
(158, 'Physique / Optique', 'PHO-12', 0, 'Simple', 0, 'All', 12, 1, 30, 10),
(159, 'Chimie', 'CH-12', 0, 'Simple', 0, 'All', 12, 1, 30, 11),
(161, 'Bio-gÃ©o-physiologie (SVT)', 'SVT-12', 0, 'Simple', 0, 'All', 12, 1, 30, 12),
(162, 'Histoire-GÃ©ographie', 'HG-12', 0, 'Simple', 0, 'All', 12, 1, 30, 13),
(163, 'Informatique', 'INFO-12', 0, 'Simple', 0, 'All', 12, 1, 20, 14),
(164, 'Introduction Ã  l Ã©conomie', 'IE-12', 0, 'Simple', 0, 'All', 12, 1, 10, 15),
(165, 'Education Artistique et EsthÃ©tique', 'EAE-12', 0, 'Simple', 0, 'All', 12, 1, 10, 16),
(166, 'Education Physique et Sport', 'EPS-12', 0, 'Simple', 0, 'All', 12, 1, 10, 17),
(167, 'Vie Scolaire / Formation Humaine', 'VS-12', 0, 'Simple', 0, 'All', 12, 1, 20, 18),
(169, 'CrÃ©ole', 'CR-13', 0, 'Simple', 0, 'All', 13, 1, 20, 6),
(170, 'Test', 'test', 0, '0', 0, '0', 0, 0, 0, 1),
(171, 'Education Ã  la CitoyennetÃ©', 'EC-12', 0, '', 0, 'All', 12, 1, 10, 1),
(172, 'Education Ã  la CitoyennetÃ©', 'EC-13', 0, '', 0, 'All', 13, 1, 10, 1),
(174, 'MagnÃ©tism', 'MG', 0, NULL, 0, NULL, 0, NULL, NULL, 1),
(175, 'Chinois', 'chi', 2, NULL, 0, NULL, 0, NULL, NULL, 1),
(176, 'Almand', 'ALM', 2, NULL, 0, NULL, 0, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_cours_par_classe`
--

CREATE TABLE `tb_cours_par_classe` (
  `id` int(11) NOT NULL,
  `id_cours` int(11) NOT NULL,
  `salle_classe` int(11) NOT NULL,
  `professeur` int(11) DEFAULT NULL,
  `coefficient` int(11) DEFAULT '10',
  `position` int(11) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_cours_par_classe`
--

INSERT INTO `tb_cours_par_classe` (`id`, `id_cours`, `salle_classe`, `professeur`, `coefficient`, `position`, `active`) VALUES
(1, 8, 42, 4, 20, 1, 1),
(2, 22, 42, 4, 20, 1, 1),
(3, 21, 42, 3, 20, 1, 1),
(4, 11, 42, 2, 20, 1, 1),
(5, 13, 45, 3, 40, 2, 1),
(6, 20, 45, 4, 40, 2, 1),
(7, 11, 45, 2, 20, 5, 1),
(8, 14, 45, 2, 20, 11, 1),
(9, 1, 42, 4, 20, 1, 1),
(10, 35, 45, 2, 20, 1, 1),
(11, 7, 42, 4, 20, 1, 1),
(12, 39, 42, 4, 20, 1, 1),
(13, 16, 42, 4, 20, 1, 1),
(14, 12, 42, 4, 20, 1, 1),
(15, 15, 42, 4, 20, 1, 1),
(16, 9, 45, 1, 20, 1, 1),
(17, 32, 45, 1, 20, 1, 1),
(18, 27, 45, 1, 20, 1, 1),
(19, 31, 45, 1, 20, 1, 1),
(20, 40, 45, 1, 20, 1, 1),
(21, 18, 45, 1, 20, 1, 1),
(22, 176, 45, 1, 20, 1, 1),
(23, 19, 45, 1, 20, 1, 1),
(24, 16, 47, 1, 40, 1, 1),
(25, 12, 47, 1, 40, 1, 1),
(26, 22, 47, 1, 40, 1, 1),
(27, 21, 47, 1, 40, 1, 1),
(28, 28, 45, 1, 20, 1, 1),
(29, 175, 45, 1, 20, 1, 1),
(30, 15, 45, 1, 20, 1, 1),
(31, 12, 45, 1, 20, 1, 1),
(32, 16, 45, 1, 20, 1, 1),
(33, 1, 45, 1, 20, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_mode_evaluations`
--

CREATE TABLE `tb_mode_evaluations` (
  `id` int(11) NOT NULL,
  `mode_evaluation` varchar(150) NOT NULL,
  `code` varchar(10) NOT NULL,
  `nb_controles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_mode_evaluations`
--

INSERT INTO `tb_mode_evaluations` (`id`, `mode_evaluation`, `code`, `nb_controles`) VALUES
(2, '5 Etapes', 'C5', 5),
(3, '4 Etapes', 'E4', 4),
(4, 'Trimestre', 'TRIM', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tb_notes`
--

CREATE TABLE `tb_notes` (
  `id` bigint(20) NOT NULL,
  `etudiant` bigint(20) NOT NULL,
  `cours` int(11) NOT NULL,
  `note` text NOT NULL,
  `periode` varchar(50) NOT NULL,
  `niveau` int(11) NOT NULL,
  `options` int(11) DEFAULT NULL,
  `aneaca` varchar(100) NOT NULL,
  `date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tag` varchar(10) NOT NULL,
  `acteur` varchar(50) DEFAULT NULL,
  `sur` int(11) DEFAULT NULL,
  `mode_evaluation` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_notes`
--

INSERT INTO `tb_notes` (`id`, `etudiant`, `cours`, `note`, `periode`, `niveau`, `options`, `aneaca`, `date_time`, `tag`, `acteur`, `sur`, `mode_evaluation`) VALUES
(1, 16, 22, '21', 'Etape 1', 6, NULL, '2020-2021', '2021-01-08 09:37:20', '', NULL, 40, 'E4'),
(2, 16, 21, '25', 'Etape 1', 6, NULL, '2020-2021', '2021-01-08 09:39:28', '', NULL, 40, 'E4'),
(3, 16, 12, '26', 'Etape 1', 6, NULL, '2020-2021', '2021-01-08 09:47:32', '', NULL, 40, 'E4'),
(4, 16, 16, '18', 'Etape 1', 6, NULL, '2020-2021', '2021-01-08 09:49:04', '', NULL, 40, 'E4'),
(5, 8, 176, '18', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 09:50:36', '', NULL, 20, 'E4'),
(6, 9, 35, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:01', '', NULL, 20, 'E4'),
(7, 13, 35, '12', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:01', '', NULL, 20, 'E4'),
(8, 12, 35, '10', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:01', '', NULL, 20, 'E4'),
(9, 5, 35, '8', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:01', '', NULL, 20, 'E4'),
(10, 8, 35, '19', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:09', '', NULL, 20, 'E4'),
(11, 10, 35, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 13:49:09', '', NULL, 20, 'E4'),
(12, 8, 14, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:46:15', '', NULL, 20, 'E4'),
(13, 8, 18, '16', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:49:05', '', NULL, 20, 'E4'),
(14, 8, 11, '18', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:50:29', '', NULL, 20, 'E4'),
(15, 8, 13, '35', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:51:46', '', NULL, 40, 'E4'),
(16, 8, 20, '30', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:53:33', '', NULL, 40, 'E4'),
(17, 8, 40, '17', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 20:54:16', '', NULL, 20, 'E4'),
(18, 5, 9, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:27:20', '', NULL, 20, 'E4'),
(19, 5, 20, '29', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:29:12', '', NULL, 40, 'E4'),
(20, 8, 31, '12', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:35:12', '', NULL, 20, 'E4'),
(22, 8, 27, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:36:35', '', NULL, 20, 'E4'),
(23, 8, 32, '19', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:37:47', '', NULL, 20, 'E4'),
(24, 8, 9, '16', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:38:58', '', NULL, 20, 'E4'),
(25, 8, 19, '17', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:39:20', '', NULL, 20, 'E4'),
(26, 5, 14, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:45:23', '', NULL, 20, 'E4'),
(27, 13, 11, '13', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 21:45:37', '', NULL, 20, 'E4'),
(28, 5, 11, '16', 'Etape 1', 7, NULL, '2020-2021', '2021-01-08 22:11:15', '', NULL, 20, 'E4'),
(29, 13, 14, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 15:07:51', '', NULL, 20, 'E4'),
(31, 13, 18, '13', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 15:08:52', '', NULL, 20, 'E4'),
(32, 13, 20, '32', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 15:22:16', '', NULL, 40, 'E4'),
(33, 13, 32, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 21:48:01', '', NULL, 20, 'E4'),
(34, 5, 32, '13', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 21:48:17', '', NULL, 20, 'E4'),
(35, 10, 32, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 22:41:26', '', NULL, 20, 'E4'),
(36, 10, 11, '17', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 22:41:34', '', NULL, 20, 'E4'),
(37, 12, 18, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 22:42:00', '', NULL, 20, 'E4'),
(38, 9, 13, '32', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 22:42:13', '', NULL, 40, 'E4'),
(39, 9, 32, '12', 'Etape 1', 7, NULL, '2020-2021', '2021-01-09 22:43:51', '', NULL, 20, 'E4'),
(40, 12, 32, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-10 10:20:55', '', NULL, 20, 'E4'),
(41, 23, 27, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-15 13:28:13', '', NULL, 20, 'E4'),
(42, 19, 35, '15', 'Etape 1', 7, NULL, '2020-2021', '2021-01-15 14:46:06', '', NULL, 20, 'E4'),
(43, 19, 9, '14', 'Etape 1', 7, NULL, '2020-2021', '2021-01-15 14:49:07', '', NULL, 20, 'E4'),
(44, 19, 32, '16', 'Etape 1', 7, NULL, '2020-2021', '2021-01-15 14:49:47', '', NULL, 20, 'E4'),
(45, 19, 27, '13', 'Etape 1', 7, NULL, '2020-2021', '2021-01-15 14:50:05', '', NULL, 20, 'E4');

-- --------------------------------------------------------

--
-- Table structure for table `tb_periodes_evaluation`
--

CREATE TABLE `tb_periodes_evaluation` (
  `id` int(11) NOT NULL,
  `mode_evaluation_code` varchar(15) NOT NULL,
  `periode` varchar(150) NOT NULL,
  `type_periode` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_periodes_evaluation`
--

INSERT INTO `tb_periodes_evaluation` (`id`, `mode_evaluation_code`, `periode`, `type_periode`) VALUES
(1, 'E4', 'Etape 1', 'S'),
(2, 'E4', 'Etape 2', 'S'),
(3, 'E4', 'Etape 3', 'S'),
(4, 'E4', 'Etape 4', 'S'),
(13, 'TRIM', 'Trimestre 1', 'S'),
(14, 'TRIM', 'Trimestre 2', 'S'),
(15, 'TRIM', 'Trimestre 3', 'S'),
(19, 'C5', 'Etape 1', 'S'),
(20, 'C5', 'Etape 2', 'S'),
(21, 'C5', 'Etape 3', 'S'),
(22, 'C5', 'Etape 4', 'S'),
(23, 'C5', 'Etape 5', 'S');

-- --------------------------------------------------------

--
-- Table structure for table `tb_personnes`
--

CREATE TABLE `tb_personnes` (
  `id` int(11) NOT NULL,
  `prenom` varchar(250) NOT NULL,
  `nom` varchar(250) NOT NULL,
  `sexe` varchar(2) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_personnes`
--

INSERT INTO `tb_personnes` (`id`, `prenom`, `nom`, `sexe`, `active`) VALUES
(1, 'Roodson', 'Romain', 'M', 1),
(2, 'Mario', 'Sajous', 'M', 1),
(3, 'Theodora', 'W. Romain', NULL, 1),
(4, 'Guerline', 'Joseph', NULL, 1),
(5, 'Kender', 'Romain', 'M', 1),
(6, 'Kerlyne', 'Jean', 'F', 1),
(7, 'Catiana', 'Rameau', 'F', 1),
(8, 'Stephanie ', 'Romain', 'F', 1),
(9, 'May-Darline', 'Belton', 'F', 1),
(10, 'Johanne', 'Rosemond', 'F', 1),
(11, 'Magdala', 'Elizaire', 'F', 1),
(12, 'Martine', 'Pierre-Louis', 'F', 1),
(13, 'Natacha', 'Jean', 'F', 1),
(14, 'Gethro', 'Pierre', 'M', 1),
(15, 'Garry', 'Desrosiers', 'M', 1),
(16, 'Marie-MichÃ¨le', 'Zamor', 'F', 1),
(17, 'Mondy', 'Badeau', 'M', 1),
(18, 'Marie Guirlaine', 'Louis', 'F', 1),
(19, 'Manola', 'Registre', 'F', 1),
(20, 'Daniel', 'Pierre', 'M', 1),
(21, 'Kerlyne', 'Louis', 'F', 1),
(22, 'Stephanie ', 'Joseph', 'F', 1),
(23, 'Sheila', 'Guillaume', 'F', 1),
(24, 'Samuel', 'Gouin', 'M', 1),
(25, 'Kelly', 'Paul', 'M', 1),
(26, 'Jean Marie', 'Pierre', 'M', 1),
(27, 'Marie Christine', 'Platel', 'F', 1),
(28, 'FranÃ§ois', 'Jean', 'M', 1),
(29, 'NadÃ¨ge', 'Louis', 'F', 1),
(30, 'Francesca', 'Dumas', 'F', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_professeurs`
--

CREATE TABLE `tb_professeurs` (
  `id` int(11) NOT NULL,
  `id_personne` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_professeurs`
--

INSERT INTO `tb_professeurs` (`id`, `id_personne`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_affectation`
--
ALTER TABLE `tb_affectation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_personne` (`id_personne`,`niveau`),
  ADD UNIQUE KEY `id_personne_2` (`id_personne`,`niveau`,`classroom`,`options`,`aneaca`);

--
-- Indexes for table `tb_categorie_cours`
--
ALTER TABLE `tb_categorie_cours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categorie` (`categorie`);

--
-- Indexes for table `tb_classes`
--
ALTER TABLE `tb_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mere` (`mere`,`classe`);

--
-- Indexes for table `tb_cours`
--
ALTER TABLE `tb_cours`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `tb_cours_par_classe`
--
ALTER TABLE `tb_cours_par_classe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_cours` (`id_cours`,`salle_classe`);

--
-- Indexes for table `tb_mode_evaluations`
--
ALTER TABLE `tb_mode_evaluations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `mode_evaluation` (`mode_evaluation`);

--
-- Indexes for table `tb_notes`
--
ALTER TABLE `tb_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `etudiant` (`etudiant`,`cours`,`periode`,`niveau`,`aneaca`);

--
-- Indexes for table `tb_periodes_evaluation`
--
ALTER TABLE `tb_periodes_evaluation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mode_evaluation_code` (`mode_evaluation_code`,`periode`);

--
-- Indexes for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_professeurs`
--
ALTER TABLE `tb_professeurs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_affectation`
--
ALTER TABLE `tb_affectation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `tb_categorie_cours`
--
ALTER TABLE `tb_categorie_cours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tb_classes`
--
ALTER TABLE `tb_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `tb_cours`
--
ALTER TABLE `tb_cours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;
--
-- AUTO_INCREMENT for table `tb_cours_par_classe`
--
ALTER TABLE `tb_cours_par_classe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `tb_mode_evaluations`
--
ALTER TABLE `tb_mode_evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `tb_notes`
--
ALTER TABLE `tb_notes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT for table `tb_periodes_evaluation`
--
ALTER TABLE `tb_periodes_evaluation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `tb_professeurs`
--
ALTER TABLE `tb_professeurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
