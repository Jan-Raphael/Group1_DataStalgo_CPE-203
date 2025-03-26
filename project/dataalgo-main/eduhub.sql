-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2025 at 03:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eduhub`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `tags` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `upvotes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `downvotes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `price` float NOT NULL DEFAULT 0,
  `purchase` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `hasAttachments` tinyint(1) NOT NULL,
  `contentType` int(11) NOT NULL DEFAULT 0,
  `PostDate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `userid`, `title`, `tags`, `description`, `upvotes`, `downvotes`, `price`, `purchase`, `attachments`, `hasAttachments`, `contentType`, `PostDate`) VALUES
(1, 1, 'Introduction to BSCS', 'programming, computer science, basics', 'Learn the fundamentals of Computer Science and programming languages such as Python and Java.', '', '', 0, '', NULL, 0, 0, '2025-03-26 12:30:00'),
(2, 3, 'Advanced BSCS Topics: Data Structures', 'data structures, algorithms, advanced, BSCS', 'Dive deeper into complex data structures and algorithms with real-world applications.', '', '', 25, '', NULL, 0, 1, '2025-03-26 12:32:05'),
(3, 5, 'BSCS Fundamentals and Applications', 'computer science, programming, fundamentals, BSCS', 'Explore the basics of computer science and its applications in various fields.', '', '', 0, '', NULL, 0, 0, '2025-03-26 12:34:10'),
(4, 7, 'BSCS: Full Stack Development', 'full stack, development, web, programming', 'Master the full stack development process and build dynamic web applications.', '', '', 0, '', NULL, 0, 2, '2025-03-26 12:36:15'),
(5, 6, 'BSCS: Machine Learning and AI', 'machine learning, AI, data science, BSCS', 'Understand machine learning concepts, algorithms, and AI tools used in data science.', '', '', 0, '', NULL, 0, 2, '2025-03-26 12:38:20'),
(6, 4, 'Introduction to Algorithms and Data Structures', 'data structures, algorithms, BSCS', 'Learn the essential algorithms and data structures needed for computer science.', '', '', 10, '', NULL, 0, 1, '2025-03-26 12:40:25'),
(7, 1, 'Object-Oriented Programming in Java', 'java, programming, OOP, BSCS', 'Understand the principles of object-oriented programming using Java.', '', '', 35, '', NULL, 0, 1, '2025-03-26 12:42:30'),
(8, 2, 'Web Development Basics', 'web development, HTML, CSS, BSCS', 'Learn the foundational concepts of building web pages using HTML and CSS.', '', '', 0, '', NULL, 0, 0, '2025-03-26 12:44:35'),
(9, 3, 'Database Management Systems', 'databases, SQL, BSCS', 'Master the concepts of database management systems and SQL language.', '', '', 45, '', NULL, 0, 1, '2025-03-26 12:46:40'),
(10, 7, 'BSCS: Data Science Introduction', 'data science, Python, machine learning, BSCS', 'Get introduced to data science concepts using Python and popular libraries.', '', '', 0, '', NULL, 0, 2, '2025-03-26 12:48:45'),
(11, 4, 'Mobile App Development for Beginners', 'mobile, app development, Android, programming', 'Learn the basics of building Android apps using Java and Android Studio.', '', '', 0, '', NULL, 0, 0, '2025-03-26 12:50:50'),
(12, 2, 'Networking and Communications in CS', 'networking, protocols, communications, BSCS', 'Study the essential concepts of computer networking, protocols, and communications.', '', '', 40, '', NULL, 0, 1, '2025-03-26 12:52:55'),
(13, 1, 'Artificial Intelligence Fundamentals', 'AI, machine learning, algorithms, BSCS', 'Learn the basics of artificial intelligence and its applications in computer science.', '', '', 0, '', NULL, 0, 2, '2025-03-26 12:55:00'),
(14, 5, 'Advanced Python Programming', 'Python, programming, advanced, BSCS', 'Master advanced Python techniques for solving complex problems.', '', '', 55, '', NULL, 0, 1, '2025-03-26 12:57:05'),
(15, 6, 'Operating Systems: Concepts and Design', 'operating systems, concepts, design, BSCS', 'Study the design and concepts behind operating systems, including memory management and file systems.', '', '', 0, '', NULL, 0, 0, '2025-03-26 12:59:10'),
(16, 4, 'Software Engineering Principles', 'software engineering, methodologies, BSCS', 'Learn the principles and methodologies used in software engineering for building high-quality software.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:01:15'),
(17, 7, 'Cybersecurity Essentials', 'cybersecurity, security, BSCS', 'Understand the fundamentals of cybersecurity and how to protect systems and networks.', '', '', 25, '', NULL, 0, 1, '2025-03-26 13:03:20'),
(18, 1, 'Introduction to Cloud Computing', 'cloud computing, AWS, Azure, BSCS', 'Get started with cloud computing platforms like AWS and Azure and understand cloud services.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:05:25'),
(19, 2, 'Game Development with Unity', 'game development, Unity, programming, BSCS', 'Learn to build 2D and 3D games using Unity and C# programming language.', '', '', 30, '', NULL, 0, 1, '2025-03-26 13:07:30'),
(20, 3, 'Big Data Analytics', 'big data, analytics, Hadoop, BSCS', 'Understand big data analytics and how to use tools like Hadoop for processing large datasets.', '', '', 0, '', NULL, 0, 2, '2025-03-26 13:09:35'),
(21, 7, 'BSCS Project Management and Agile', 'project management, agile, BSCS', 'Learn the principles of project management and agile methodologies for software development.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:11:40'),
(22, 5, 'Advanced JavaScript for Web Development', 'JavaScript, web development, advanced, BSCS', 'Learn advanced JavaScript concepts to build dynamic, interactive websites.', '', '', 35, '', NULL, 0, 1, '2025-03-26 13:13:45'),
(23, 4, 'Cloud-Native Applications', 'cloud-native, applications, Docker, Kubernetes, BSCS', 'Learn how to build cloud-native applications using Docker, Kubernetes, and microservices architecture.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:15:50'),
(24, 2, 'Data Visualization with Python', 'data visualization, Python, data science, BSCS', 'Learn to create stunning data visualizations with Python libraries like Matplotlib and Seaborn.', '', '', 0, '', NULL, 0, 2, '2025-03-26 13:17:55'),
(25, 1, 'DevOps Practices and Tools', 'DevOps, continuous integration, tools, BSCS', 'Master DevOps practices and tools for automating software deployment and development pipelines.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:20:00'),
(26, 6, 'Introduction to Quantum Computing', 'quantum computing, physics, computing, BSCS', 'Understand the basics of quantum computing and its future impact on technology.', '', '', 40, '', NULL, 0, 1, '2025-03-26 13:22:05'),
(27, 3, 'Deep Learning with TensorFlow', 'deep learning, TensorFlow, machine learning, BSCS', 'Learn deep learning algorithms and how to implement them using TensorFlow.', '', '', 0, '', NULL, 0, 2, '2025-03-26 13:24:10'),
(28, 7, 'Data Structures and Algorithms in C', 'data structures, algorithms, C programming, BSCS', 'Study data structures and algorithms in C programming language with real-world examples.', '', '', 25, '', NULL, 0, 1, '2025-03-26 13:26:15'),
(29, 1, 'Introduction to Software Testing', 'software testing, QA, BSCS', 'Learn the essential techniques and tools for software testing and quality assurance.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:28:20'),
(30, 5, 'AI in Healthcare', 'AI, healthcare, machine learning, BSCS', 'Explore the applications of artificial intelligence in the healthcare industry.', '', '', 35, '', NULL, 0, 1, '2025-03-26 13:30:25'),
(31, 6, 'Introduction to Computational Theory', 'computational theory, algorithms, mathematics, BSCS', 'Learn the foundations of computational theory and its applications in computer science.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:32:30'),
(32, 7, 'Automated Software Testing with Selenium', 'software testing, Selenium, automation, BSCS', 'Learn how to automate web application testing using Selenium.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:34:35'),
(33, 2, 'Blockchain Fundamentals', 'blockchain, cryptocurrency, Ethereum, BSCS', 'Get a solid foundation in blockchain technology and its applications, including cryptocurrency.', '', '', 40, '', NULL, 0, 1, '2025-03-26 13:36:40'),
(34, 4, 'Introduction to Data Mining', 'data mining, analytics, BSCS', 'Learn about data mining techniques and their applications in real-world scenarios.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:38:45'),
(35, 1, 'Network Security and Cryptography', 'network security, cryptography, BSCS', 'Understand the importance of network security and cryptographic techniques used in securing communication.', '', '', 0, '', NULL, 0, 0, '2025-03-26 13:40:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL DEFAULT '0',
  `balance` double NOT NULL DEFAULT 0,
  `subscriptionprice` double NOT NULL DEFAULT 1,
  `subscribers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `followers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `JoinDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `token`, `username`, `email`, `password`, `avatar`, `balance`, `subscriptionprice`, `subscribers`, `followers`, `JoinDate`) VALUES
(1, '', 'JoshLei', 'joshydevelopment@gmail.com', '123', '0', 0, 1, '[]', '[]', '2024-06-18'),
(2, '', 'TrishaLei', 'trishalei@gmail.com', '123', '0', 0, 1, '[]', '[]', '2022-11-25'),
(3, '', 'Leish', 'Leish@gmail.com', '123', '0', 0, 1, '[]', '[]', '2023-04-09'),
(4, '', 'John', 'John@gmail.com', '123', '0', 0, 1, '[]', '[]', '2023-06-14'),
(5, '', 'Mike', 'Mike@gmail.com', '123', '0', 0, 1, '[]', '[]', '2024-06-01'),
(6, '', 'Michael', 'Michael@gmail.com', '123', '0', 0, 1, '[]', '[]', '2024-08-24'),
(7, '', 'Andrei', 'Andrei@gmail.com', '123', '0', 0, 1, '[]', '[]', '2025-03-20'),
(8, '', 'Wonwoo', 'Wonwoo@gmail.com', '123', '0', 0, 1, '[]', '[]', '2025-02-10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
