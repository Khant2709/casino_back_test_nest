CREATE TABLE IF NOT EXISTS casino (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  domain VARCHAR(255) NOT NULL,
  has_redirect TINYINT(1) NOT NULL DEFAULT 0,
  domain_new VARCHAR(255) DEFAULT NULL,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_domain (domain),
  UNIQUE KEY uq_domain_new (domain_new)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  casino_id INT UNSIGNED NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  title VARCHAR(255),
  description TEXT NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT,
  available_from DATETIME DEFAULT NULL,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_articles_slug_casino (casino_id, slug),
  KEY fk_articles_casino (casino_id),
  CONSTRAINT fk_articles_casino
    FOREIGN KEY (casino_id) REFERENCES casino(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  casino_id INT UNSIGNED NOT NULL,
  page VARCHAR(255) NOT NULL,
  content TEXT,
  title VARCHAR(255),
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT,
  date_create DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_update DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_page_casino (casino_id, page),
  KEY fk_pages_casino (casino_id),
  CONSTRAINT fk_pages_casino
    FOREIGN KEY (casino_id) REFERENCES casino(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
