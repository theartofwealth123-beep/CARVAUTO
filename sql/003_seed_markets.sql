-- Carvauto - Initial Markets Seed (edit radius_miles as desired)
-- Note: center_lat/center_lng are optional right now. You can fill later.

insert into markets (name, state, radius_miles) values
-- CALIFORNIA
('Los Angeles', 'CA', 100),
('San Diego', 'CA', 75),
('San Francisco', 'CA', 75),
('San Jose', 'CA', 75),
('Sacramento', 'CA', 75),
('Fresno', 'CA', 75),
('Bakersfield', 'CA', 75),
('Riverside / Inland Empire', 'CA', 100),
('Oakland / East Bay', 'CA', 75),
('Stockton', 'CA', 75),

-- NEVADA
('Las Vegas', 'NV', 100),
('Reno', 'NV', 100),

-- COLORADO
('Denver', 'CO', 100),
('Colorado Springs', 'CO', 75),
('Fort Collins', 'CO', 75),

-- ARIZONA
('Phoenix', 'AZ', 125),
('Tucson', 'AZ', 100),

-- NEW MEXICO
('Albuquerque', 'NM', 125),

-- TEXAS
('Dallas–Fort Worth', 'TX', 125),
('Houston', 'TX', 125),
('Austin', 'TX', 100),
('San Antonio', 'TX', 100),
('El Paso', 'TX', 125),

-- ARKANSAS
('Little Rock', 'AR', 125),

-- OKLAHOMA
('Oklahoma City', 'OK', 125),
('Tulsa', 'OK', 100),

-- UTAH
('Salt Lake City', 'UT', 125),

-- LOUISIANA
('New Orleans', 'LA', 100),
('Baton Rouge', 'LA', 100),
('Shreveport', 'LA', 125)
;
