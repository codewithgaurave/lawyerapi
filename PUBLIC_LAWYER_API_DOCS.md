# Public Lawyer APIs - Complete Documentation

**Base URL:** `http://localhost:5001`
**Auth:** No authentication required (Public APIs)

---

## Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/lawyers/public | None | Get all active lawyers with complete profile |
| GET | /api/lawyers/public/:id | None | Get single lawyer complete profile by ID |
| GET | /api/lawyers/search | None | Search lawyers with filters |

---

## 1. GET ALL PUBLIC LAWYERS

```
GET /api/lawyers/public
```

Returns all active lawyers with their complete profile including experiences, certificates, education, skills, and services.

### Response (200)

```json
{
  "success": true,
  "count": 2,
  "lawyers": [
    {
      "lawyer": {
        "_id": "69cd66f8965d5d85ccafa7f0",
        "registration_type": "Individual",
        "full_name": "Vikram Sharma",
        "mobile_number": "9111111111",
        "email": "vikram.sharma@gmail.com",
        "bar_council_number": "BC_IND_001",
        "bar_council_state": "Delhi",
        "years_of_experience": 10,
        "specialization": "Criminal Law",
        "classification": "Criminal",
        "sub_classification": null,
        "office_address": "123 Law Street, Connaught Place",
        "city": "Delhi",
        "state": "Delhi",
        "pincode": "110001",
        "office_latitude": 28.6139,
        "office_longitude": 77.2090,
        "about_lawyer": "Experienced criminal lawyer with 10 years of practice",
        "consultation_fee": 5000,
        "languages_spoken": ["Hindi", "English", "Punjabi"],
        "availability_time": "Mon-Fri 10AM-6PM",
        "bar_enrollment_date": "2014-05-15T00:00:00.000Z",
        "court_practice": "Supreme Court & High Court",
        "law_degree": "LLB, LLM",
        "university_name": "Delhi University",
        "graduation_year": 2013,
        "license_document": null,
        "bar_council_certificate": null,
        "linkedin_url": "https://linkedin.com/in/vikramsharma",
        "website_url": "https://vikramsharma.com",
        "firm_name": null,
        "firm_registration_number": null,
        "firm_email": null,
        "isActive": true,
        "createdAt": "2026-04-01T18:26:58.979Z",
        "updatedAt": "2026-04-01T18:27:00.432Z"
      },
      "experiences": [
        {
          "_id": "69cd670d965d5d85ccafa7f4",
          "lawyer_id": "69cd66f8965d5d85ccafa7f0",
          "job_title": "Senior Advocate",
          "company_name": "Delhi High Court",
          "location": "Delhi",
          "start_date": "2020-01-01T00:00:00.000Z",
          "end_date": "2023-12-31T00:00:00.000Z",
          "is_current": false,
          "description": "Handled criminal cases"
        }
      ],
      "certificates": [
        {
          "_id": "69cd6721965d5d85ccafa7fb",
          "lawyer_id": "69cd66f8965d5d85ccafa7f0",
          "certificate_name": "Bar Council Certificate",
          "issuing_organization": "Bar Council of India",
          "issue_date": "2015-06-01T00:00:00.000Z",
          "expiry_date": null,
          "credential_id": "BCI-2015-001",
          "credential_url": null,
          "certificate_file": "https://res.cloudinary.com/..."
        }
      ],
      "education": [
        {
          "_id": "69cd672f965d5d85ccafa800",
          "lawyer_id": "69cd66f8965d5d85ccafa7f0",
          "degree": "LLB",
          "field_of_study": "Law",
          "school_name": "Delhi University",
          "start_date": "2010-07-01T00:00:00.000Z",
          "end_date": "2013-06-30T00:00:00.000Z",
          "grade": "First Class",
          "description": null
        }
      ],
      "skills": [
        {
          "_id": "69cd673a965d5d85ccafa805",
          "lawyer_id": "69cd66f8965d5d85ccafa7f0",
          "skill_name": "Criminal Litigation",
          "proficiency_level": "Expert",
          "endorsements": 1
        }
      ],
      "services": [
        {
          "_id": "69cd67e7aea54ea5611d2a7e",
          "lawyer_id": "69cd66f8965d5d85ccafa7f0",
          "service_name": "Criminal Case Consultation",
          "description": "Expert consultation for criminal cases",
          "price": 5000,
          "duration": "1 hour"
        }
      ]
    }
  ]
}
```

### cURL

```bash
curl http://localhost:5001/api/lawyers/public
```

---

## 2. GET SINGLE LAWYER BY ID

```
GET /api/lawyers/public/:id
```

Returns complete profile of a single lawyer by their ID.

### URL Parameters

- `id` - Lawyer's MongoDB ObjectId

### Response (200)

```json
{
  "lawyer": {
    "_id": "69cd66f8965d5d85ccafa7f0",
    "full_name": "Vikram Sharma",
    "...": "all lawyer fields"
  },
  "experiences": [...],
  "certificates": [...],
  "education": [...],
  "skills": [...],
  "services": [...]
}
```

### Error Response (404)

```json
{
  "message": "Lawyer not found"
}
```

### cURL

```bash
curl http://localhost:5001/api/lawyers/public/69cd66f8965d5d85ccafa7f0
```

---

## 3. SEARCH LAWYERS

```
GET /api/lawyers/search
```

Search and filter lawyers by various criteria. Returns complete profile for each matching lawyer.

### Query Parameters

You can use any of these parameters to filter:

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | String | `?search=criminal` | Search across all text fields |
| `city` | String | `?city=Delhi` | Filter by city |
| `state` | String | `?state=Delhi` | Filter by state |
| `specialization` | String | `?specialization=Criminal Law` | Filter by specialization |
| `classification` | String | `?classification=Criminal` | Criminal/Civil/Corporate Law |
| `years_of_experience` | Number | `?years_of_experience=10` | Exact years match |
| `consultation_fee` | Number | `?consultation_fee=5000` | Exact fee match |
| `languages_spoken` | String | `?languages_spoken=Hindi` | Filter by language |
| `bar_council_state` | String | `?bar_council_state=Delhi` | Filter by bar council state |

### Multiple Filters

You can combine multiple filters:

```
GET /api/lawyers/search?city=Delhi&specialization=Criminal Law&years_of_experience=10
```

### Search Example

The `search` parameter searches across:
- full_name, email, mobile_number
- bar_council_number, bar_council_state
- specialization, classification, sub_classification
- office_address, city, state, pincode
- about_lawyer, court_practice
- law_degree, university_name
- languages_spoken, firm_name
- years_of_experience, consultation_fee, graduation_year (numeric)

### Response (200)

```json
{
  "success": true,
  "count": 1,
  "lawyers": [
    {
      "lawyer": {
        "_id": "69cd66f8965d5d85ccafa7f0",
        "full_name": "Vikram Sharma",
        "city": "Delhi",
        "specialization": "Criminal Law",
        "...": "all other fields"
      },
      "experiences": [...],
      "certificates": [...],
      "education": [...],
      "skills": [...],
      "services": [...]
    }
  ]
}
```

### cURL Examples

**Search by text:**
```bash
curl "http://localhost:5001/api/lawyers/search?search=criminal"
```

**Filter by city:**
```bash
curl "http://localhost:5001/api/lawyers/search?city=Delhi"
```

**Multiple filters:**
```bash
curl "http://localhost:5001/api/lawyers/search?city=Delhi&specialization=Criminal%20Law"
```

**Filter by experience:**
```bash
curl "http://localhost:5001/api/lawyers/search?years_of_experience=10"
```

---

## React - Display All Lawyers

```jsx
import { useState, useEffect } from 'react';

export default function PublicLawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/lawyers/public');
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setLawyers(data.lawyers);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading lawyers...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>All Lawyers ({lawyers.length})</h1>
      
      {lawyers.map(({ lawyer, experiences, certificates, education, skills, services }) => (
        <div key={lawyer._id} style={{ border: '1px solid #ddd', padding: 20, marginBottom: 20, borderRadius: 8 }}>
          
          {/* Basic Info */}
          <h2>{lawyer.full_name}</h2>
          <p><strong>{lawyer.specialization}</strong> | {lawyer.years_of_experience} years experience</p>
          <p>{lawyer.city}, {lawyer.state}</p>
          <p>Consultation Fee: ₹{lawyer.consultation_fee}</p>
          <p>{lawyer.about_lawyer}</p>
          
          {/* Contact */}
          <p>📞 {lawyer.mobile_number} | 📧 {lawyer.email}</p>
          <p>Languages: {lawyer.languages_spoken?.join(', ')}</p>
          <p>Available: {lawyer.availability_time}</p>
          
          {/* Bar Council */}
          <p><strong>Bar Council:</strong> {lawyer.bar_council_number} ({lawyer.bar_council_state})</p>
          <p><strong>Court Practice:</strong> {lawyer.court_practice}</p>
          
          {/* Experiences */}
          {experiences.length > 0 && (
            <div>
              <h4>Experience ({experiences.length})</h4>
              {experiences.map(exp => (
                <div key={exp._id} style={{ marginLeft: 20 }}>
                  <p><strong>{exp.job_title}</strong> at {exp.company_name}</p>
                  <p>{exp.location} | {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h4>Education ({education.length})</h4>
              {education.map(edu => (
                <div key={edu._id} style={{ marginLeft: 20 }}>
                  <p><strong>{edu.degree}</strong> in {edu.field_of_study} - {edu.school_name}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h4>Skills ({skills.length})</h4>
              <p style={{ marginLeft: 20 }}>
                {skills.map(skill => `${skill.skill_name} (${skill.proficiency_level})`).join(', ')}
              </p>
            </div>
          )}
          
          {/* Services */}
          {services.length > 0 && (
            <div>
              <h4>Services ({services.length})</h4>
              {services.map(service => (
                <div key={service._id} style={{ marginLeft: 20 }}>
                  <p><strong>{service.service_name}</strong> - ₹{service.price} ({service.duration})</p>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Links */}
          <div style={{ marginTop: 10 }}>
            {lawyer.linkedin_url && <a href={lawyer.linkedin_url} target="_blank" style={{ marginRight: 10 }}>LinkedIn</a>}
            {lawyer.website_url && <a href={lawyer.website_url} target="_blank">Website</a>}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## React - Search Lawyers

```jsx
import { useState } from 'react';

export default function SearchLawyers() {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    specialization: '',
    classification: '',
  });
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Build query string
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });

    try {
      const res = await fetch(`http://localhost:5001/api/lawyers/search?${params}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
        return;
      }
      
      setLawyers(data.lawyers);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Search Lawyers</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: 30 }}>
        <input
          name="search"
          placeholder="Search by name, specialization, city..."
          value={filters.search}
          onChange={handleChange}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input name="city" placeholder="City" value={filters.city} onChange={handleChange} style={{ padding: 10 }} />
          <input name="state" placeholder="State" value={filters.state} onChange={handleChange} style={{ padding: 10 }} />
          <input name="specialization" placeholder="Specialization" value={filters.specialization} onChange={handleChange} style={{ padding: 10 }} />
          
          <select name="classification" value={filters.classification} onChange={handleChange} style={{ padding: 10 }}>
            <option value="">All Classifications</option>
            <option value="Criminal">Criminal</option>
            <option value="Civil">Civil</option>
            <option value="Corporate Law">Corporate Law</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 10, padding: '10px 30px', background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Results ({lawyers.length})</h2>
      
      {lawyers.map(({ lawyer, experiences, education, skills, services }) => (
        <div key={lawyer._id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 15, borderRadius: 8 }}>
          <h3>{lawyer.full_name}</h3>
          <p>{lawyer.specialization} | {lawyer.city}, {lawyer.state}</p>
          <p>₹{lawyer.consultation_fee} | {lawyer.years_of_experience} years</p>
          <p>{lawyer.about_lawyer}</p>
          
          {services.length > 0 && (
            <p><strong>Services:</strong> {services.map(s => s.service_name).join(', ')}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## React - Single Lawyer Profile

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function LawyerPublicProfile() {
  const { id } = useParams(); // Get lawyer ID from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/lawyers/public/${id}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message);
        return;
      }
      
      setProfile(data);
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!profile) return null;

  const { lawyer, experiences, certificates, education, skills, services } = profile;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #007bff', paddingBottom: 20, marginBottom: 20 }}>
        <h1>{lawyer.full_name}</h1>
        <p style={{ fontSize: 18, color: '#666' }}>{lawyer.specialization} | {lawyer.classification}</p>
        <p>{lawyer.city}, {lawyer.state}</p>
      </div>

      {/* About */}
      <section style={{ marginBottom: 30 }}>
        <h2>About</h2>
        <p>{lawyer.about_lawyer}</p>
        <p><strong>Experience:</strong> {lawyer.years_of_experience} years</p>
        <p><strong>Consultation Fee:</strong> ₹{lawyer.consultation_fee}</p>
        <p><strong>Languages:</strong> {lawyer.languages_spoken?.join(', ')}</p>
        <p><strong>Availability:</strong> {lawyer.availability_time}</p>
      </section>

      {/* Contact */}
      <section style={{ marginBottom: 30 }}>
        <h2>Contact</h2>
        <p>📞 {lawyer.mobile_number}</p>
        <p>📧 {lawyer.email}</p>
        <p>📍 {lawyer.office_address}, {lawyer.city}, {lawyer.state} - {lawyer.pincode}</p>
      </section>

      {/* Bar Council */}
      <section style={{ marginBottom: 30 }}>
        <h2>Bar Council Details</h2>
        <p><strong>Number:</strong> {lawyer.bar_council_number}</p>
        <p><strong>State:</strong> {lawyer.bar_council_state}</p>
        <p><strong>Enrollment Date:</strong> {new Date(lawyer.bar_enrollment_date).toLocaleDateString()}</p>
        <p><strong>Court Practice:</strong> {lawyer.court_practice}</p>
      </section>

      {/* Experience */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>Experience</h2>
          {experiences.map(exp => (
            <div key={exp._id} style={{ marginBottom: 15 }}>
              <h4>{exp.job_title}</h4>
              <p>{exp.company_name} | {exp.location}</p>
              <p>{new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>Education</h2>
          {education.map(edu => (
            <div key={edu._id} style={{ marginBottom: 15 }}>
              <h4>{edu.degree} in {edu.field_of_study}</h4>
              <p>{edu.school_name}</p>
              <p>{new Date(edu.start_date).getFullYear()} - {new Date(edu.end_date).getFullYear()}</p>
              <p>Grade: {edu.grade}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {skills.map(skill => (
              <span key={skill._id} style={{ background: '#e9ecef', padding: '5px 15px', borderRadius: 20 }}>
                {skill.skill_name} ({skill.proficiency_level})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>Certificates</h2>
          {certificates.map(cert => (
            <div key={cert._id} style={{ marginBottom: 15 }}>
              <h4>{cert.certificate_name}</h4>
              <p>{cert.issuing_organization}</p>
              <p>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
              {cert.certificate_file && (
                <img src={cert.certificate_file} alt="Certificate" style={{ maxWidth: 300, marginTop: 10 }} />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section style={{ marginBottom: 30 }}>
          <h2>Services Offered</h2>
          {services.map(service => (
            <div key={service._id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 10, borderRadius: 8 }}>
              <h4>{service.service_name}</h4>
              <p>{service.description}</p>
              <p><strong>Price:</strong> ₹{service.price} | <strong>Duration:</strong> {service.duration}</p>
            </div>
          ))}
        </section>
      )}

      {/* Social Links */}
      <section>
        <h2>Links</h2>
        {lawyer.linkedin_url && <a href={lawyer.linkedin_url} target="_blank" style={{ marginRight: 20 }}>LinkedIn</a>}
        {lawyer.website_url && <a href={lawyer.website_url} target="_blank">Website</a>}
      </section>
    </div>
  );
}
```

---

## Important Notes

- **No Authentication Required** - These are public APIs accessible to anyone
- **Only Active Lawyers** - Only lawyers with `isActive: true` are returned
- **Complete Profile** - All APIs return lawyer data along with experiences, certificates, education, skills, and services
- **Search is Flexible** - The search parameter searches across 15+ fields including text and numeric fields
- **Filter Combination** - You can combine multiple filters in search API
- **Case Insensitive** - All text searches are case-insensitive

---

## API Summary

| Endpoint | Returns | Use Case |
|----------|---------|----------|
| `/api/lawyers/public` | All active lawyers | Display lawyer directory/listing |
| `/api/lawyers/public/:id` | Single lawyer by ID | Display individual lawyer profile page |
| `/api/lawyers/search` | Filtered lawyers | Search/filter functionality |

---

## Testing

**Get all lawyers:**
```bash
curl http://localhost:5001/api/lawyers/public
```

**Get single lawyer:**
```bash
curl http://localhost:5001/api/lawyers/public/69cd66f8965d5d85ccafa7f0
```

**Search by city:**
```bash
curl "http://localhost:5001/api/lawyers/search?city=Delhi"
```

**Search by text:**
```bash
curl "http://localhost:5001/api/lawyers/search?search=criminal"
```

**Multiple filters:**
```bash
curl "http://localhost:5001/api/lawyers/search?city=Delhi&specialization=Criminal%20Law&years_of_experience=10"
```
