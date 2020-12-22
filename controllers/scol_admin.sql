-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 21, 2020 at 09:01 PM
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
(45, 7, '7Ã¨me AnnÃ©e Fondamentale A', '7Ã¨AF A');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_classes`
--
ALTER TABLE `tb_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mere` (`mere`,`classe`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_classes`
--
ALTER TABLE `tb_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
