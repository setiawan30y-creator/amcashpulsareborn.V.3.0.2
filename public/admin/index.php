<?php

// Keep /admin working when Apache resolves the physical public/admin directory.
// The real Laravel front controller remains public/index.php.
require dirname(__DIR__) . '/index.php';
