-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-06-2023 a las 21:32:50
-- Versión del servidor: 10.4.17-MariaDB
-- Versión de PHP: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `audioapp`
--
CREATE DATABASE IF NOT EXISTS `audioapp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE `audioapp`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `center`
--
-- Creación: 26-06-2023 a las 16:59:06
--

DROP TABLE IF EXISTS `center`;
CREATE TABLE `center` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `CIF` varchar(9) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` int(9) NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `direccion` varchar(300) COLLATE utf8mb4_spanish_ci NOT NULL,
  `imagen` varchar(200) COLLATE utf8mb4_spanish_ci NOT NULL,
  `nextpaciente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `center`:
--

--
-- Volcado de datos para la tabla `center`
--

INSERT INTO `center` (`id`, `nombre`, `CIF`, `telefono`, `email`, `direccion`, `imagen`, `nextpaciente`) VALUES
(1, 'Empresa1', '12345678F', 605605605, 'contact@empresa1.com', 'C/Inventada 54, 28888, Alcobendas, Madrid', 'centro-logoAudio.png', 12),
(2, 'RV Alfa Tres Cantos', '12345678A', 603603603, 'contacto@rvalfa.es', 'Sector Pueblos 2, Local D2, 28760, Tres Cantos, Madrid', 'centro-rvalfa.png', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--
-- Creación: 29-04-2023 a las 16:44:51
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `idusu` int(11) NOT NULL,
  `comentario` varchar(1000) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `comments`:
--   `idusu`
--       `patient` -> `id`
--

--
-- Volcado de datos para la tabla `comments`
--

INSERT INTO `comments` (`id`, `idusu`, `comentario`) VALUES
(2, 147, 'Paciente adaptado anteriormente en otro centro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--
-- Creación: 26-06-2023 a las 17:17:28
-- Última actualización: 29-06-2023 a las 17:43:59
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `company` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cif` varchar(9) COLLATE utf8mb4_spanish_ci NOT NULL,
  `correo` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `telefono` varchar(12) COLLATE utf8mb4_spanish_ci NOT NULL,
  `observaciones` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `ambp` tinyint(1) NOT NULL DEFAULT 0,
  `ambm` tinyint(1) NOT NULL DEFAULT 0,
  `ambr` tinyint(1) NOT NULL DEFAULT 0,
  `ambf` tinyint(1) NOT NULL DEFAULT 0,
  `idcompany` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `companies`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `company`, `cif`, `correo`, `telefono`, `observaciones`, `ambp`, `ambm`, `ambr`, `ambf`, `idcompany`) VALUES
(1, 'Oticon', '11222333L', 'oticon@oticon.es', '+34654654654', 'Empresa Oticon', 1, 1, 0, 1, 1),
(4, 'Phonak', 'A82571605', 'info@phonak.com', '+34965674312', '', 1, 1, 1, 1, 1),
(6, 'Oticon', '44555666Y', 'oticon@oticon.es', '916444455', '', 1, 1, 0, 0, 2),
(7, 'Phonak', '55669888H', 'phonak@phonak.es', '654654654', '', 1, 1, 1, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contacts`
--
-- Creación: 29-04-2023 a las 10:44:36
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `idusu` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL COMMENT '1-telefono // 2-email',
  `valor` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `comentario` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL DEFAULT 'Comentario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `contacts`:
--   `idusu`
--       `patient` -> `id`
--

--
-- Volcado de datos para la tabla `contacts`
--

INSERT INTO `contacts` (`id`, `idusu`, `tipo`, `valor`, `comentario`) VALUES
(3, 139, 2, 'maria.g@gmail.com', 'Comentario'),
(4, 139, 1, '+34658659657', 'Comentario'),
(5, 140, 2, 'juan@gmail.com', 'Comentario'),
(6, 140, 1, '+34621632666', 'Comentario'),
(11, 141, 1, '+34658696366', 'Comentario'),
(14, 140, 2, 'guapo@gmail.com', 'Comentario'),
(15, 141, 2, 'manolita@gmail.com', 'Comentario'),
(19, 143, 2, 'pepitogrillo@gmail.com', 'Comentario'),
(20, 143, 1, '+34666777888', 'Comentario'),
(21, 144, 2, 'juanma@gmail.com', 'Comentario'),
(22, 144, 1, '+34622333777', 'Comentario'),
(23, 145, 2, 'noelia@gmail.com', 'Comentario'),
(24, 145, 1, '+34622633677', 'Comentario'),
(25, 146, 2, 'ana.vd@gmail.com', 'Comentario'),
(26, 146, 1, '+34698321987', 'Comentario'),
(27, 147, 2, 'josemiguel.gr@gmail.com', 'Principal'),
(28, 147, 1, '+34655699688', 'Principal'),
(32, 147, 1, '+34666999888', 'Teléfono Hijo'),
(36, 150, 2, 'fernando.mg@gmail.com', 'Principal'),
(37, 150, 1, '+34605605612', 'Principal'),
(38, 150, 1, '+34669558775', 'Teléfono Hijo'),
(40, 133, 1, '654698652', 'Principal'),
(43, 152, 2, 'rebeca.gj@gmail.com', 'Principal'),
(44, 152, 1, '605615615', 'Principal'),
(45, 153, 2, 'pedrocanora@gmail.com', 'Principal'),
(46, 153, 1, '623654987', 'Principal'),
(47, 154, 2, 'robertosanro@hotmail.es', 'Principal'),
(48, 154, 1, '622365987', 'Principal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dataestimate`
--
-- Creación: 26-06-2023 a las 17:34:38
-- Última actualización: 29-06-2023 a las 19:13:59
--

DROP TABLE IF EXISTS `dataestimate`;
CREATE TABLE `dataestimate` (
  `id` int(11) NOT NULL,
  `idpres` int(11) NOT NULL,
  `idprod` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `iddesc` int(11) NOT NULL,
  `descuento` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `dataestimate`:
--   `idpres`
--       `estimates` -> `id`
--   `idprod`
--       `product` -> `id`
--

--
-- Volcado de datos para la tabla `dataestimate`
--

INSERT INTO `dataestimate` (`id`, `idpres`, `idprod`, `cantidad`, `iddesc`, `descuento`) VALUES
(1, 1, 2, 2, 1, 40),
(8, 1, 3, 1, 1, 100),
(13, 4, 2, 2, 1, 50),
(15, 1, 1, 8, 1, 10),
(16, 3, 2, 2, 1, 20),
(17, 5, 2, 2, 1, 20),
(18, 7, 1, 10, 1, 0),
(19, 7, 2, 1, 1, 20),
(22, 9, 4, 2, 1, 15),
(23, 9, 5, 10, 1, 50),
(24, 10, 4, 4, 1, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dataorder`
--
-- Creación: 30-05-2023 a las 15:17:34
--

DROP TABLE IF EXISTS `dataorder`;
CREATE TABLE `dataorder` (
  `id` int(11) NOT NULL,
  `idOrder` int(11) NOT NULL,
  `idProd` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `comentario` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `dataorder`:
--   `idOrder`
--       `orders` -> `id`
--   `idProd`
--       `product` -> `id`
--

--
-- Volcado de datos para la tabla `dataorder`
--

INSERT INTO `dataorder` (`id`, `idOrder`, `idProd`, `cantidad`, `comentario`) VALUES
(1, 4, 1, 2, ''),
(4, 3, 3, 3, ''),
(6, 4, 2, 1, 'prueba'),
(9, 6, 3, 4, ''),
(10, 9, 1, 5, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datapayment`
--
-- Creación: 29-06-2023 a las 18:44:01
-- Última actualización: 29-06-2023 a las 18:44:15
--

DROP TABLE IF EXISTS `datapayment`;
CREATE TABLE `datapayment` (
  `id` int(11) NOT NULL,
  `idsale` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `cantidad` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `datapayment`:
--   `idsale`
--       `estimates` -> `id`
--

--
-- Volcado de datos para la tabla `datapayment`
--

INSERT INTO `datapayment` (`id`, `idsale`, `tipo`, `cantidad`) VALUES
(1, 4, 1, 2000),
(2, 9, 1, 2000),
(3, 9, 2, 2267.5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estimates`
--
-- Creación: 22-06-2023 a las 17:28:15
-- Última actualización: 29-06-2023 a las 19:15:58
--

DROP TABLE IF EXISTS `estimates`;
CREATE TABLE `estimates` (
  `id` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1-Presupuesto // 2-Venta',
  `idpac` int(11) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1 COMMENT '1-Pendiente // 2-Aceptado // 3-Rechazado',
  `comentario` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechamodificacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `estimates`:
--   `estado`
--       `estimatesstates` -> `id`
--   `idpac`
--       `patient` -> `id`
--

--
-- Volcado de datos para la tabla `estimates`
--

INSERT INTO `estimates` (`id`, `tipo`, `idpac`, `estado`, `comentario`, `fecha`, `fechamodificacion`) VALUES
(1, 2, 147, 1, '20-05-2023/0001', '2023-05-20 16:10:45', '2023-06-22 17:28:15'),
(3, 1, 147, 3, 'Prueba desde usuario', '2023-05-20 17:17:24', '2023-06-22 17:28:15'),
(4, 2, 141, 2, 'Prueba de carmena', '2023-05-20 17:46:38', '2023-06-22 17:28:15'),
(5, 1, 147, 1, '02-06-2023/P0236', '2023-06-02 12:05:36', '2023-06-22 17:28:15'),
(6, 1, 143, 3, '03-06-2023/00036', '2023-06-03 16:35:42', '2023-06-22 17:28:15'),
(7, 2, 136, 1, '12356*adssad', '2023-06-25 16:41:54', '2023-06-25 16:41:54'),
(9, 2, 152, 2, '123456-66', '2023-06-29 17:19:00', '2023-06-29 17:19:00'),
(10, 2, 152, 1, 'P-22365', '2023-06-29 17:19:20', '2023-06-29 17:19:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estimatesstates`
--
-- Creación: 20-05-2023 a las 17:04:19
--

DROP TABLE IF EXISTS `estimatesstates`;
CREATE TABLE `estimatesstates` (
  `id` int(11) NOT NULL,
  `valor` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `estimatesstates`:
--

--
-- Volcado de datos para la tabla `estimatesstates`
--

INSERT INTO `estimatesstates` (`id`, `valor`) VALUES
(1, 'Pendiente'),
(2, 'Finalizada'),
(3, 'Rechazado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event`
--
-- Creación: 25-06-2023 a las 20:04:15
-- Última actualización: 29-06-2023 a las 19:23:49
--

DROP TABLE IF EXISTS `event`;
CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `paciente` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFin` time NOT NULL,
  `asignada` int(11) NOT NULL,
  `comentario` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `event`:
--   `tipo`
--       `eventtype` -> `id`
--   `paciente`
--       `patient` -> `id`
--

--
-- Volcado de datos para la tabla `event`
--

INSERT INTO `event` (`id`, `paciente`, `tipo`, `fecha`, `horaInicio`, `horaFin`, `asignada`, `comentario`) VALUES
(1, 147, 1, '2023-05-06', '13:30:00', '14:30:00', 1, 'Prueba de comentario'),
(4, 133, 2, '2023-05-31', '13:00:00', '14:30:00', 1, ''),
(5, 145, 2, '2023-05-30', '17:30:00', '18:30:00', 1, ''),
(6, 133, 1, '2023-06-26', '10:40:00', '13:00:00', 1, ''),
(7, 152, 1, '2023-06-30', '10:30:00', '12:00:00', 2, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventtype`
--
-- Creación: 26-06-2023 a las 16:24:31
--

DROP TABLE IF EXISTS `eventtype`;
CREATE TABLE `eventtype` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `color` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `tipo` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0-Block // 1-Ususario',
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `eventtype`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `eventtype`
--

INSERT INTO `eventtype` (`id`, `nombre`, `color`, `tipo`, `idcompany`) VALUES
(1, 'Primera visita', '#31D038', 0, NULL),
(2, 'Revisión', '#FFA1FF', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `histories`
--
-- Creación: 26-06-2023 a las 17:30:28
-- Última actualización: 29-06-2023 a las 17:13:11
--

DROP TABLE IF EXISTS `histories`;
CREATE TABLE `histories` (
  `id` int(11) NOT NULL,
  `idusu` int(11) NOT NULL,
  `iddoc` int(11) NOT NULL,
  `contenido` longtext COLLATE utf8mb4_spanish_ci NOT NULL,
  `fechaHistoria` date NOT NULL,
  `horaHistoria` time NOT NULL,
  `tipo` int(11) NOT NULL COMMENT '1-Revisión // 2-Llamada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `histories`:
--   `iddoc`
--       `usuario` -> `id`
--   `idusu`
--       `patient` -> `id`
--

--
-- Volcado de datos para la tabla `histories`
--

INSERT INTO `histories` (`id`, `idusu`, `iddoc`, `contenido`, `fechaHistoria`, `horaHistoria`, `tipo`) VALUES
(6, 143, 1, 'Hola, funcionará?', '2023-03-21', '21:21:00', 1),
(7, 143, 1, 'Oooooootra más, modificada', '2023-03-21', '21:25:00', 1),
(8, 143, 1, 'Ahora si que sí', '2023-03-21', '21:28:00', 2),
(9, 141, 1, 'Historia primera de Manuela', '2023-03-23', '20:11:00', 2),
(10, 147, 1, 'Se llama al paciente para recordarle la próxima cita. Este nos comenta que actualmente está teniendo problemas con su adaptación, los audífonos pitan demasiado.', '2023-04-29', '18:49:00', 2),
(11, 147, 1, 'Se le revisan los pitidos de los audífonos. Se le vuelven a configurar y a limpiar.', '2023-04-30', '17:00:00', 1),
(12, 147, 1, 'Se hace una revisión de la última configuración y está todo correcto.', '2023-05-19', '19:05:00', 1),
(14, 152, 2, 'Se le hace la primera revisión con pérdida en oído derecho.', '2023-06-26', '19:26:00', 1),
(15, 152, 2, 'Nos ponemos en contacto con el paciente para asegurarnos de que no tiene molestias.', '2023-06-29', '19:11:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ivatype`
--
-- Creación: 26-06-2023 a las 17:33:09
-- Última actualización: 29-06-2023 a las 19:16:35
--

DROP TABLE IF EXISTS `ivatype`;
CREATE TABLE `ivatype` (
  `id` int(11) NOT NULL,
  `Tipo` tinyint(1) NOT NULL COMMENT '0 -Block // 1 - Usuario',
  `nombre` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL,
  `valor` int(11) NOT NULL,
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `ivatype`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `ivatype`
--

INSERT INTO `ivatype` (`id`, `Tipo`, `nombre`, `valor`, `idcompany`) VALUES
(1, 0, 'Sin IVA', 0, NULL),
(2, 0, 'IVA General', 21, NULL),
(3, 1, 'IVA Reducido', 10, 1),
(4, 1, 'IVA Ultra Reducido', 4, 1),
(5, 1, 'IVA Reducido', 10, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job`
--
-- Creación: 26-06-2023 a las 16:41:21
-- Última actualización: 29-06-2023 a las 19:18:01
--

DROP TABLE IF EXISTS `job`;
CREATE TABLE `job` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `job`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `job`
--

INSERT INTO `job` (`id`, `nombre`, `idcompany`) VALUES
(2, 'Audiólogo', NULL),
(3, 'Administrativo', 1),
(5, 'Gestor', 1),
(6, 'Administrativo', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--
-- Creación: 26-06-2023 a las 20:12:21
-- Última actualización: 29-06-2023 a las 18:54:57
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `idpac` int(11) DEFAULT NULL,
  `referencia` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idcomp` int(11) NOT NULL,
  `estado` int(11) NOT NULL DEFAULT 1,
  `fechaCreacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechaModificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `idcompany` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `orders`:
--   `idcomp`
--       `companies` -> `id`
--   `idpac`
--       `patient` -> `id`
--   `estado`
--       `orderstates` -> `id`
--

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `tipo`, `idpac`, `referencia`, `idcomp`, `estado`, `fechaCreacion`, `fechaModificacion`, `idcompany`) VALUES
(3, 0, NULL, 'Prueba Empresa', 1, 1, '2023-05-30 15:34:00', '2023-06-25 21:48:10', 1),
(4, 1, 147, '76576576', 1, 1, '2023-05-30 15:34:00', '2023-06-25 21:48:14', 1),
(6, 1, 147, '', 1, 3, '2023-06-02 13:14:25', '2023-06-25 21:48:16', 1),
(9, 1, 147, '', 4, 2, '2023-06-02 16:20:03', '2023-06-25 21:48:19', 1),
(10, 0, NULL, 'preuba', 1, 1, '2023-06-25 21:43:59', '2023-06-25 21:48:21', 1),
(12, 1, 152, 'PE-2556', 6, 3, '2023-06-29 17:44:21', '2023-06-29 18:54:57', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orderstates`
--
-- Creación: 16-05-2023 a las 19:13:35
--

DROP TABLE IF EXISTS `orderstates`;
CREATE TABLE `orderstates` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `orderstates`:
--

--
-- Volcado de datos para la tabla `orderstates`
--

INSERT INTO `orderstates` (`id`, `nombre`) VALUES
(1, 'En creación'),
(2, 'Enviado al proveedor'),
(3, 'Entregado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient`
--
-- Creación: 26-06-2023 a las 16:57:22
--

DROP TABLE IF EXISTS `patient`;
CREATE TABLE `patient` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `primerApellido` varchar(40) COLLATE utf8mb4_spanish_ci NOT NULL,
  `segundoApellido` varchar(40) COLLATE utf8mb4_spanish_ci NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `DNI` varchar(9) COLLATE utf8mb4_spanish_ci NOT NULL,
  `genero` tinyint(1) NOT NULL COMMENT '1-mujer // 2-hombre // 3-Otro',
  `direccion` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `poblacion` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cp` mediumint(5) NOT NULL,
  `patientType` int(11) NOT NULL DEFAULT 1,
  `idcompany` int(11) NOT NULL,
  `ncliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `patient`:
--   `patientType`
--       `patienttype` -> `id`
--

--
-- Volcado de datos para la tabla `patient`
--

INSERT INTO `patient` (`id`, `nombre`, `primerApellido`, `segundoApellido`, `fechaNacimiento`, `DNI`, `genero`, `direccion`, `poblacion`, `cp`, `patientType`, `idcompany`, `ncliente`) VALUES
(133, 'Adrian', 'Diaz', 'Jimenez', '1988-06-29', '44555666P', 2, 'Calle Invento, 1, portal 5, 6ºA', 'Colmenar Viejo', 28888, 1, 1, 1),
(136, 'Alejandro', 'Diaz', 'Jimenez', '1985-08-20', '47455856w', 3, 'Calle invento, 44, portal 54, 9ºB', 'Alcorcon', 28923, 2, 1, 2),
(139, 'Maria', 'Gonzalez', 'Dominguez', '1968-05-05', '55555654A', 1, 'Calle Pueba 5, P5, 5ºB', 'Mostoles', 28956, 1, 1, 3),
(140, 'Juan', 'Morales', 'Garcia', '1964-09-03', '44444555F', 3, 'Avenida de la isla, 36', 'Potes', 22222, 1, 1, 4),
(141, 'Manuela', 'Carmena', 'Rebollo', '2000-06-09', '33366987G', 1, 'Avenida PAnamericana 5', 'Madrid', 28002, 1, 1, 5),
(143, 'Pepito', 'Grillo', 'Martínez', '1958-01-01', '44444444G', 3, 'Calle padrón 2', 'Alcorcon', 28923, 1, 1, 6),
(144, 'Juan Manuel', 'Pérez', 'Carrillo', '1942-07-20', '11111222A', 2, 'Calle Inventada 12, 6ºA', 'Alcobendas', 25555, 1, 1, 7),
(145, 'Noelia', 'Fernandez', 'Martinez', '1963-02-22', '56789123F', 1, 'Avenida Comunidad de Madrid, 33, 5ºG', 'Alcobendas', 28888, 1, 1, 8),
(146, 'Ana María', 'Vedia', 'Diaz', '1963-06-05', '32654987J', 1, 'Calle Real 15', 'Cenicientos', 28650, 1, 1, 9),
(147, 'Jose Miguel', 'González', 'Rico', '1956-06-15', '04567982G', 1, 'Avenida de Madrid, 12, Portal 3, 4ºA', 'Tres Cantos', 28760, 2, 1, 10),
(150, 'Fernando', 'Martínez', 'González', '1975-05-20', '45888963G', 2, 'Calle inventada 12, portal 5, 4ºB', 'Alcobendas', 28108, 1, 1, 11),
(152, 'Rebeca', 'González', 'Jiménez', '1965-06-22', '44555666T', 1, 'C/ de la fuente 13, 4ºA', 'Mostóles', 28888, 1, 2, 1),
(153, 'Pedro', 'Canora', 'Rodríguez', '1933-01-11', '02365987T', 2, 'Avenida de la libertad 14', 'Pozuelo', 25654, 1, 2, 2),
(154, 'Roberto', 'San Román', 'Díaz', '1963-06-05', '22654987G', 2, 'C/ del Grano 33, 5ºC', 'Torrelodones', 25631, 2, 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patienttype`
--
-- Creación: 26-06-2023 a las 17:14:26
-- Última actualización: 29-06-2023 a las 17:49:28
--

DROP TABLE IF EXISTS `patienttype`;
CREATE TABLE `patienttype` (
  `id` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL COMMENT '0-block // 1-usuario',
  `nombre` varchar(30) COLLATE utf8mb4_spanish_ci NOT NULL,
  `colorTexto` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `colorFondo` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `patienttype`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `patienttype`
--

INSERT INTO `patienttype` (`id`, `tipo`, `nombre`, `colorTexto`, `colorFondo`, `idcompany`) VALUES
(1, 0, 'Inicial', '#000000', '#38ff4f', NULL),
(2, 0, 'Adaptado', '#ff0000', '#000000', NULL),
(3, 1, 'Tapones', '#000000', '#ff8a8a', 1),
(4, 1, 'Tapones', '#000000', '#ffbdf1', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paymentmethods`
--
-- Creación: 26-06-2023 a las 17:12:57
--

DROP TABLE IF EXISTS `paymentmethods`;
CREATE TABLE `paymentmethods` (
  `id` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL COMMENT '0 - block // 1-Usuario',
  `nombre` varchar(30) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `paymentmethods`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `paymentmethods`
--

INSERT INTO `paymentmethods` (`id`, `tipo`, `nombre`, `idcompany`) VALUES
(1, 0, 'Efectivo', NULL),
(2, 0, 'Tarjeta', NULL),
(3, 1, 'Bizum', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--
-- Creación: 25-06-2023 a las 19:56:41
-- Última actualización: 29-06-2023 a las 18:29:14
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `precioCompra` float NOT NULL DEFAULT 0,
  `precioVenta` float NOT NULL DEFAULT 0,
  `tipoIVA` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `referencia` varchar(30) COLLATE utf8mb4_spanish_ci NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `cantidadminima` int(11) NOT NULL DEFAULT 0,
  `descripcion` varchar(500) COLLATE utf8mb4_spanish_ci NOT NULL,
  `marca` int(11) NOT NULL DEFAULT 0,
  `proveedor` int(11) NOT NULL DEFAULT 0,
  `reparable` int(11) NOT NULL DEFAULT 0,
  `ns` int(11) NOT NULL DEFAULT 0,
  `recurrente` int(11) NOT NULL DEFAULT 0,
  `idcompany` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `product`:
--   `idcompany`
--       `center` -> `id`
--   `tipoIVA`
--       `ivatype` -> `id`
--   `tipo`
--       `producttype` -> `id`
--

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `nombre`, `precioCompra`, `precioVenta`, `tipoIVA`, `tipo`, `referencia`, `cantidad`, `cantidadminima`, `descripcion`, `marca`, `proveedor`, `reparable`, `ns`, `recurrente`, `idcompany`) VALUES
(1, 'Caja De 60 Pilas Para Audífonos - Phonak 312', 10, 18, 2, 3, '', 4, 5, '', 4, 4, 1, 0, 0, 1),
(2, 'Audifono 1', 500, 2000, 2, 1, '', 2, 0, '', 1, 1, 1, 1, 0, 1),
(3, 'Rueda Pila 312', 1.08, 3.5, 2, 3, '', 0, 5, '', 1, 1, 0, 0, 0, 1),
(4, 'Audifono1', 1000, 2500, 2, 1, 'RE-85695', 10, 0, '', 7, 7, 1, 1, 0, 2),
(5, 'Rueda de pilas', 1.5, 3.5, 2, 2, 'RE-asdas', 50, 10, '', 6, 6, 0, 0, 0, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producttype`
--
-- Creación: 26-06-2023 a las 17:16:37
-- Última actualización: 29-06-2023 a las 19:16:43
--

DROP TABLE IF EXISTS `producttype`;
CREATE TABLE `producttype` (
  `id` int(11) NOT NULL,
  `tipo` int(11) NOT NULL DEFAULT 0 COMMENT '0-Block // 1-usuario',
  `valor` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idcompany` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `producttype`:
--   `idcompany`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `producttype`
--

INSERT INTO `producttype` (`id`, `tipo`, `valor`, `idcompany`) VALUES
(1, 0, 'Audífono', NULL),
(2, 0, 'Accesorio', NULL),
(3, 1, 'Complemento', 1),
(4, 1, 'Servicio', 1),
(5, 1, 'Otros', 1),
(6, 1, 'Complemento', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `serialnumbers`
--
-- Creación: 22-06-2023 a las 17:11:03
-- Última actualización: 29-06-2023 a las 18:41:58
--

DROP TABLE IF EXISTS `serialnumbers`;
CREATE TABLE `serialnumbers` (
  `id` int(11) NOT NULL,
  `idpac` int(11) NOT NULL,
  `idprod` int(11) NOT NULL,
  `nserie` varchar(100) COLLATE utf8mb4_spanish_ci NOT NULL,
  `idsale` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `serialnumbers`:
--   `idpac`
--       `patient` -> `id`
--   `idprod`
--       `product` -> `id`
--   `idsale`
--       `estimates` -> `id`
--

--
-- Volcado de datos para la tabla `serialnumbers`
--

INSERT INTO `serialnumbers` (`id`, `idpac`, `idprod`, `nserie`, `idsale`, `fecha`) VALUES
(3, 141, 2, 'adssadsa', 4, '2023-06-22 17:36:03'),
(4, 141, 2, 'adssads', 4, '2023-06-22 17:36:03'),
(5, 152, 4, 'Aud-1234', 9, '2023-06-29 18:41:58'),
(6, 152, 4, 'Aud-1235', 9, '2023-06-29 18:41:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--
-- Creación: 31-05-2023 a las 11:48:35
-- Última actualización: 29-06-2023 a las 19:30:03
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `sessions`:
--

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('8VLgcYRUcXwqSsNWN6KdNiA3iFSqNsSx', 1688148469, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1},\"flash\":{}}'),
('CDpXW80Xg8bC6vlQsOLprEXkmTMG5rUS', 1688071093, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":2},\"flash\":{}}'),
('KjjIpLcmhSeB1O5yw7FMVNlhL51-YWkW', 1688153404, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--
-- Creación: 25-06-2023 a las 19:42:20
-- Última actualización: 29-06-2023 a las 19:17:50
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `primerApellido` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `segundoApellido` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `puestoTrabajo` int(11) NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_spanish_ci NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `isAdmin` tinyint(1) NOT NULL COMMENT '0-No // 1-Si ',
  `company` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- RELACIONES PARA LA TABLA `usuario`:
--   `company`
--       `center` -> `id`
--

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `primerApellido`, `segundoApellido`, `email`, `puestoTrabajo`, `pass`, `active`, `isAdmin`, `company`) VALUES
(1, 'Johanna', 'Marin', '', 'johanna@audioapp.es', 3, '$2a$10$RLSLyVVviRtxSMueOASL4.s.eVcODaZS0bE0k476JlbaCj/j7INQe', 1, 0, 1),
(2, 'Adrian', 'Diaz', 'Jimenez', 'adridiji@gmail.com', 2, '$2a$10$5QJMTz93dDkosu5x/4KZ0.OHj4/9FCBrxJ6Efa88nnZbjvvVx1sIq', 1, 1, 2),
(3, 'Juan', 'Jimenez', 'Pimentel', 'juan@audioapp.es', 2, '$2a$10$W3TA.x6FkKxEuzQ814IRlOYJxBayfThCzC4TvisCZcF3Y85APskD.', 1, 0, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `center`
--
ALTER TABLE `center`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fk_pacienteComentario` (`idusu`) USING BTREE;

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_companiesidcompany` (`idcompany`);

--
-- Indices de la tabla `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuContacto` (`idusu`);

--
-- Indices de la tabla `dataestimate`
--
ALTER TABLE `dataestimate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dataestimateIDProd` (`idprod`),
  ADD KEY `fk_dataestimateIDPres` (`idpres`) USING BTREE;

--
-- Indices de la tabla `dataorder`
--
ALTER TABLE `dataorder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dataOrderOderID` (`idOrder`),
  ADD KEY `fk_dataOrderProdID` (`idProd`);

--
-- Indices de la tabla `datapayment`
--
ALTER TABLE `datapayment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_dataSale` (`idsale`);

--
-- Indices de la tabla `estimates`
--
ALTER TABLE `estimates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_estimatesIDpac` (`idpac`),
  ADD KEY `fk_estimatesIDestado` (`estado`);

--
-- Indices de la tabla `estimatesstates`
--
ALTER TABLE `estimatesstates`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eventuserid` (`paciente`),
  ADD KEY `fk_eventtype` (`tipo`);

--
-- Indices de la tabla `eventtype`
--
ALTER TABLE `eventtype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_eventypeidCompany` (`idcompany`);

--
-- Indices de la tabla `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patientHistory` (`idusu`),
  ADD KEY `fk_historiesidusu` (`iddoc`);

--
-- Indices de la tabla `ivatype`
--
ALTER TABLE `ivatype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ivatypeiscompany` (`idcompany`);

--
-- Indices de la tabla `job`
--
ALTER TABLE `job`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_jobsCompany` (`idcompany`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ordersPacienteID` (`idpac`),
  ADD KEY `fk_ordersComanpyID` (`idcomp`),
  ADD KEY `fk_ordersState` (`estado`);

--
-- Indices de la tabla `orderstates`
--
ALTER TABLE `orderstates`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_patientType` (`patientType`);

--
-- Indices de la tabla `patienttype`
--
ALTER TABLE `patienttype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_patienttypeidcompany` (`idcompany`);

--
-- Indices de la tabla `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_paymentmethodidcompany` (`idcompany`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_productIVAType` (`tipoIVA`),
  ADD KEY `fk_productType` (`tipo`),
  ADD KEY `fk_productCompany` (`idcompany`);

--
-- Indices de la tabla `producttype`
--
ALTER TABLE `producttype`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producttypeidcompany` (`idcompany`);

--
-- Indices de la tabla `serialnumbers`
--
ALTER TABLE `serialnumbers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_nsIdPac` (`idpac`),
  ADD KEY `fk_nsIdProd` (`idprod`),
  ADD KEY `fk_nsIdSale` (`idsale`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userCompany` (`company`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `center`
--
ALTER TABLE `center`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `dataestimate`
--
ALTER TABLE `dataestimate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `dataorder`
--
ALTER TABLE `dataorder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `datapayment`
--
ALTER TABLE `datapayment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estimates`
--
ALTER TABLE `estimates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estimatesstates`
--
ALTER TABLE `estimatesstates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `eventtype`
--
ALTER TABLE `eventtype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `histories`
--
ALTER TABLE `histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `ivatype`
--
ALTER TABLE `ivatype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `job`
--
ALTER TABLE `job`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `orderstates`
--
ALTER TABLE `orderstates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `patient`
--
ALTER TABLE `patient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT de la tabla `patienttype`
--
ALTER TABLE `patienttype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `paymentmethods`
--
ALTER TABLE `paymentmethods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `producttype`
--
ALTER TABLE `producttype`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `serialnumbers`
--
ALTER TABLE `serialnumbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_pacienteComentario` FOREIGN KEY (`idusu`) REFERENCES `patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `fk_companiesidcompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `usuContacto` FOREIGN KEY (`idusu`) REFERENCES `patient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `dataestimate`
--
ALTER TABLE `dataestimate`
  ADD CONSTRAINT `fk_dataestimateIDPres` FOREIGN KEY (`idpres`) REFERENCES `estimates` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dataestimateIDProd` FOREIGN KEY (`idprod`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `dataorder`
--
ALTER TABLE `dataorder`
  ADD CONSTRAINT `fk_dataOrderOderID` FOREIGN KEY (`idOrder`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dataOrderProdID` FOREIGN KEY (`idProd`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `datapayment`
--
ALTER TABLE `datapayment`
  ADD CONSTRAINT `fk_dataSale` FOREIGN KEY (`idsale`) REFERENCES `estimates` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `estimates`
--
ALTER TABLE `estimates`
  ADD CONSTRAINT `fk_estimatesIDestado` FOREIGN KEY (`estado`) REFERENCES `estimatesstates` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_estimatesIDpac` FOREIGN KEY (`idpac`) REFERENCES `patient` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `fk_eventtype` FOREIGN KEY (`tipo`) REFERENCES `eventtype` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_eventuserid` FOREIGN KEY (`paciente`) REFERENCES `patient` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `eventtype`
--
ALTER TABLE `eventtype`
  ADD CONSTRAINT `fk_eventypeidCompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `histories`
--
ALTER TABLE `histories`
  ADD CONSTRAINT `fk_historiesidusu` FOREIGN KEY (`iddoc`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `patientHistory` FOREIGN KEY (`idusu`) REFERENCES `patient` (`id`);

--
-- Filtros para la tabla `ivatype`
--
ALTER TABLE `ivatype`
  ADD CONSTRAINT `fk_ivatypeiscompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `job`
--
ALTER TABLE `job`
  ADD CONSTRAINT `fk_jobsCompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_ordersComanpyID` FOREIGN KEY (`idcomp`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ordersPacienteID` FOREIGN KEY (`idpac`) REFERENCES `patient` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ordersState` FOREIGN KEY (`estado`) REFERENCES `orderstates` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `fk_patientType` FOREIGN KEY (`patientType`) REFERENCES `patienttype` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `patienttype`
--
ALTER TABLE `patienttype`
  ADD CONSTRAINT `fk_patienttypeidcompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `paymentmethods`
--
ALTER TABLE `paymentmethods`
  ADD CONSTRAINT `fk_paymentmethodidcompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_productCompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_productIVAType` FOREIGN KEY (`tipoIVA`) REFERENCES `ivatype` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_productType` FOREIGN KEY (`tipo`) REFERENCES `producttype` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `producttype`
--
ALTER TABLE `producttype`
  ADD CONSTRAINT `fk_producttypeidcompany` FOREIGN KEY (`idcompany`) REFERENCES `center` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `serialnumbers`
--
ALTER TABLE `serialnumbers`
  ADD CONSTRAINT `fk_nsIdPac` FOREIGN KEY (`idpac`) REFERENCES `patient` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nsIdProd` FOREIGN KEY (`idprod`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nsIdSale` FOREIGN KEY (`idsale`) REFERENCES `estimates` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_userCompany` FOREIGN KEY (`company`) REFERENCES `center` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
