import { useEffect, useState } from "react";
import "./Clinic.css";

const doctors = [
  {
    id: "dr-ava",
    name: "Dr. Ava Mitchell",
    specialty: "Cardiologist",
    degree: "MD, FACC",
    experience: "12 years experience",
    rating: "4.98",
    reviews: 284,
    fee: 120,
    location: "Northstar Medical Center",
    address: "245 Park Avenue, New York, NY",
    hours: "Mon – Fri, 9:00 AM – 5:00 PM",
    workingDays: [1, 2, 3, 4, 5],
    openMinutes: 540,
    closeMinutes: 1020,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=760&q=85",
    bio: "Dr. Mitchell is dedicated to helping patients build healthier hearts through thoughtful, evidence-based care. She specializes in preventive cardiology and managing long-term heart conditions.",
    qualifications: ["MD, Columbia University", "Fellowship in Cardiology, NYU Langone"],
    color: "mint",
  },
  {
    id: "dr-noah",
    name: "Dr. Noah Williams",
    specialty: "Dermatologist",
    degree: "MD, FAAD",
    experience: "9 years experience",
    rating: "4.95",
    reviews: 196,
    fee: 95,
    location: "Willow Skin & Wellness",
    address: "18 West 23rd Street, New York, NY",
    hours: "Mon – Sat, 10:00 AM – 6:00 PM",
    workingDays: [1, 2, 3, 4, 5, 6],
    openMinutes: 600,
    closeMinutes: 1080,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=760&q=85",
    bio: "Dr. Williams combines clinical expertise with a personal approach to skin health. From everyday concerns to complex conditions, he makes sure every patient feels heard and cared for.",
    qualifications: ["MD, Weill Cornell Medicine", "Board Certified, American Academy of Dermatology"],
    color: "lavender",
  },
  {
    id: "dr-maya",
    name: "Dr. Maya Patel",
    specialty: "Pediatrician",
    degree: "MD, FAAP",
    experience: "15 years experience",
    rating: "4.99",
    reviews: 342,
    fee: 110,
    location: "Brightside Children's Clinic",
    address: "720 Lexington Avenue, New York, NY",
    hours: "Mon – Fri, 8:30 AM – 4:30 PM",
    workingDays: [1, 2, 3, 4, 5],
    openMinutes: 510,
    closeMinutes: 990,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=760&q=85",
    bio: "Dr. Patel believes healthy childhoods begin with a trusted partnership between doctor, child, and family. She provides comprehensive care from infancy through adolescence.",
    qualifications: ["MD, Icahn School of Medicine", "Residency in Pediatrics, Mount Sinai"],
    color: "peach",
  },
  {
    id: "dr-ethan",
    name: "Dr. Ethan Brooks",
    specialty: "Neurologist",
    degree: "MD, FAAN",
    experience: "11 years experience",
    rating: "4.93",
    reviews: 173,
    fee: 140,
    location: "Northstar Medical Center",
    address: "245 Park Avenue, New York, NY",
    hours: "Tue – Sat, 9:00 AM – 5:00 PM",
    workingDays: [2, 3, 4, 5, 6],
    openMinutes: 540,
    closeMinutes: 1020,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=760&q=85",
    bio: "Dr. Brooks brings a calm, collaborative approach to neurological care. His clinical interests include headache medicine, sleep disorders, and helping patients navigate complex diagnoses.",
    qualifications: ["MD, Boston University", "Neurology Residency, NYU Langone"],
    color: "blue",
  },
  {
    id: "dr-sofia",
    name: "Dr. Sofia Chen",
    specialty: "Dentist",
    degree: "DDS",
    experience: "8 years experience",
    rating: "4.96",
    reviews: 218,
    fee: 85,
    location: "Orchard Dental Studio",
    address: "36 East 14th Street, New York, NY",
    hours: "Mon – Fri, 9:00 AM – 6:00 PM",
    workingDays: [1, 2, 3, 4, 5],
    openMinutes: 540,
    closeMinutes: 1080,
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=760&q=85",
    bio: "Dr. Chen is passionate about making dental care comfortable and accessible. She focuses on preventive dentistry and creating personalized treatment plans for every smile.",
    qualifications: ["DDS, University of Michigan", "Member, American Dental Association"],
    color: "rose",
  },
];

const specialties = ["Cardiologist", "Dermatologist", "Pediatrician", "Neurologist", "Dentist"];
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
];
const emptyPatient = { name: "", age: "", gender: "", phone: "", email: "", reason: "" };
const appointmentStorageKey = "carepoint-appointments";
const blockedStorageKey = "carepoint-blocked-slots";

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function Icon({ name, size = 18, className = "" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    back: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    print: <><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  };
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || paths.check}
    </svg>
  );
}

function dateValue(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value, options = { weekday: "long", month: "long", day: "numeric", year: "numeric" }) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", options).format(new Date(`${value}T12:00:00`));
}

function timeToMinutes(time) {
  const [clock, period] = time.split(" ");
  const [hours, minutes] = clock.split(":").map(Number);
  return (hours % 12 + (period === "PM" ? 12 : 0)) * 60 + minutes;
}

function sortByDateTime(first, second) { return `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`); }

function makeAppointmentId() {
  const random = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `CP-${new Date().getFullYear()}-${random.toUpperCase()}`;
}

function DoctorCard({ doctor, availableToday, onProfile, onBook }) {
  return (
    <article className="doctor-card">
      <button className="doctor-photo-button" onClick={() => onProfile(doctor)} aria-label={`View ${doctor.name}'s profile`}>
        <img className="doctor-photo" src={doctor.image} alt={doctor.name} />
        <span className={`availability-pill ${availableToday ? "" : "is-later"}`}>
          <span />{availableToday ? "Available today" : "Next available soon"}
        </span>
      </button>
      <div className="doctor-card-body">
        <div className="doctor-card-heading">
          <div>
            <h3>{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty} <span>·</span> {doctor.degree}</p>
          </div>
          <div className="rating"><Icon name="star" size={15} /><strong>{doctor.rating}</strong></div>
        </div>
        <div className="doctor-meta">
          <span><Icon name="pin" size={15} />{doctor.location}</span>
          <span><Icon name="users" size={15} />{doctor.experience}</span>
        </div>
        <div className="doctor-card-footer">
          <div><span className="fee-label">Consultation</span><strong>${doctor.fee}<small> / visit</small></strong></div>
          <button className="button button-primary button-small" onClick={() => onBook(doctor)}>Book visit <Icon name="arrow" size={15} /></button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [appointments, setAppointments] = useState(() => readStorage(appointmentStorageKey, []));
  const [blockedSlots, setBlockedSlots] = useState(() => readStorage(blockedStorageKey, []));
  const [activePage, setActivePage] = useState("doctors");
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingDate, setBookingDate] = useState(dateValue(new Date(new Date().getTime() + 86400000)));
  const [bookingSlot, setBookingSlot] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [patient, setPatient] = useState(emptyPatient);
  const [bookingError, setBookingError] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("Upcoming");
  const [adminDate, setAdminDate] = useState(dateValue(new Date()));
  const [adminDoctor, setAdminDoctor] = useState(doctors[0].id);
  const [adminTime, setAdminTime] = useState("");
  const [notice, setNotice] = useState("");
  const confirmedCount = appointments.filter((item) => item.status === "Confirmed").length;

  useEffect(() => {
    window.localStorage.setItem(appointmentStorageKey, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    window.localStorage.setItem(blockedStorageKey, JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const query = search.trim().toLowerCase();
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = !query || `${doctor.name} ${doctor.specialty} ${doctor.location}`.toLowerCase().includes(query);
    const matchesSpecialty = specialty === "All specialties" || doctor.specialty === specialty;
    return matchesSearch && matchesSpecialty && (!availabilityOnly || hasAvailabilityToday(doctor));
  });

  function clearDoctorFilters() { setSearch(""); setSpecialty("All specialties"); setAvailabilityOnly(false); }

  function matchesAppointmentFilter(appointment, filter = appointmentFilter) {
    if (filter === "Upcoming") return appointment.status === "Confirmed" && appointment.date >= today;
    if (filter === "Past") return appointment.status === "Completed" || (appointment.date < today && appointment.status !== "Cancelled");
    return appointment.status === "Cancelled";
  }

  const existingAppointment = booking?.rescheduleId
    ? appointments.find((appointment) => appointment.id === booking.rescheduleId)
    : null;

  function openBooking(doctor, appointment = null) {
    setProfileDoctor(null);
    setBooking({ doctor, rescheduleId: appointment?.id || null });
    setBookingDate(appointment?.date || nextAvailableDate(doctor));
    setBookingSlot(appointment?.time || "");
    setPatient(appointment ? { ...appointment.patient } : emptyPatient);
    setBookingStep(1);
    setBookingError("");
  }

  function closeBooking() {
    setBooking(null);
    setBookingError("");
  }

  function slotState(doctorId, date, time) {
    const doctor = doctors.find((item) => item.id === doctorId);
    if (!doctor || !date || !doctor.workingDays.includes(new Date(`${date}T12:00:00`).getDay())) return "disabled";
    if (date < dateValue(new Date())) return "disabled";
    if (blockedSlots.some((slot) => slot.date === date && (!slot.time || slot.time === time) && (!slot.doctorId || slot.doctorId === doctorId))) return "disabled";
    if (appointments.some((item) => item.doctorId === doctorId && item.date === date && item.time === time && item.status !== "Cancelled" && item.id !== booking?.rescheduleId)) return "booked";
    const slotMinutes = timeToMinutes(time);
    if (date === dateValue(new Date()) && time) {
      const slotDate = new Date();
      slotDate.setHours(Math.floor(slotMinutes / 60), slotMinutes % 60, 0, 0);
      if (slotDate <= new Date()) return "disabled";
    }
    if (slotMinutes < doctor.openMinutes || slotMinutes >= doctor.closeMinutes) return "disabled";
    return "available";
  }

  function hasAvailabilityToday(doctor) {
    const today = dateValue(new Date());
    return timeSlots.some((time) => slotState(doctor.id, today, time) === "available");
  }

  function nextAvailableDate(doctor) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    while (!doctor.workingDays.includes(date.getDay())) date.setDate(date.getDate() + 1);
    return dateValue(date);
  }

  function nextBookingStep() {
    if (!bookingSlot || slotState(booking.doctor.id, bookingDate, bookingSlot) !== "available") {
      setBookingError("Please select an available appointment time.");
      return;
    }
    setBookingError("");
    setBookingStep(2);
  }

  function reviewBooking(event) {
    event.preventDefault();
    const phoneDigits = patient.phone.replace(/\D/g, "").length;
    if (phoneDigits < 7 || phoneDigits > 15) {
      setBookingError("Enter a phone number with 7 to 15 digits.");
      return;
    }
    setBookingError("");
    setBookingStep(3);
  }

  function confirmBooking() {
    if (slotState(booking.doctor.id, bookingDate, bookingSlot) !== "available") {
      setBookingError("That appointment time is no longer available. Please choose another slot.");
      setBookingStep(1);
      return;
    }
    const appointment = {
      ...(booking.rescheduleId
        ? existingAppointment
        : {
          id: makeAppointmentId(),
          doctorId: booking.doctor.id,
          doctorName: booking.doctor.name,
          specialty: booking.doctor.specialty,
          image: booking.doctor.image,
          fee: booking.doctor.fee,
          location: booking.doctor.location,
          address: booking.doctor.address,
          createdAt: new Date().toISOString(),
        }),
      date: bookingDate,
      time: bookingSlot,
      patient: { ...patient },
      status: "Confirmed",
    };

    setAppointments((items) => booking.rescheduleId
      ? items.map((item) => item.id === booking.rescheduleId ? appointment : item)
      : [appointment, ...items]);
    setBooking((current) => ({ ...current, completedAppointment: appointment }));

    if (booking.rescheduleId) {
      setNotice("Your appointment has been rescheduled.");
    }
    setBookingStep(4);
  }

  function cancelAppointment(id) {
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item));
    setNotice("Appointment cancelled.");
  }

  function updateAppointmentStatus(id, status) {
    setAppointments((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(`Appointment marked ${status.toLowerCase()}.`);
  }

  function addBlockedSlot(event) {
    event.preventDefault();
    const key = `${adminDate}-${adminDoctor}-${adminTime || "all"}`;
    if (blockedSlots.some((slot) => slot.key === key)) {
      setNotice("This date or time is already blocked.");
      return;
    }
    setBlockedSlots((items) => [...items, {
      key,
      date: adminDate,
      time: adminTime || null,
      doctorId: adminDoctor,
      doctorName: doctors.find((doctor) => doctor.id === adminDoctor)?.name || "Doctor",
    }]);
    setAdminTime("");
    setNotice(adminTime ? "Time slot blocked." : "Doctor's schedule blocked for this date.");
  }

  function downloadSummary(appointment) {
    const summary = [
      "CAREPOINT — APPOINTMENT CONFIRMATION",
      `Appointment ID: ${appointment.id}`,
      `Patient: ${appointment.patient.name}`,
      `Age: ${appointment.patient.age}`,
      `Gender: ${appointment.patient.gender}`,
      `Phone: ${appointment.patient.phone}`,
      `Email: ${appointment.patient.email}`,
      `Doctor: ${appointment.doctorName}`,
      `Specialty: ${appointment.specialty}`,
      `Date: ${formatDate(appointment.date)}`,
      `Time: ${appointment.time}`,
      `Clinic: ${appointment.location}`,
      `Address: ${appointment.address}`,
      `Consultation fee: $${appointment.fee}`,
      `Reason for visit: ${appointment.patient.reason || "Not provided"}`,
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
    link.download = `${appointment.id}-appointment.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  const today = dateValue(new Date());
  const visibleAppointments = appointments.filter(matchesAppointmentFilter).sort(sortByDateTime);
  const groupedAppointments = [...appointments].sort(sortByDateTime);
  const selectedDoctor = booking?.doctor;
  const confirmedAppointment = booking?.completedAppointment || (booking?.rescheduleId ? appointments.find((item) => item.id === booking.rescheduleId) : null);

  return (
    <div className="app-shell">
      <div className="top-strip">
        <div className="top-strip-inner"><span><Icon name="shield" size={14} /> Your health information is always private and secure</span><span>Need help? <a href="tel:+12125550142">(212) 555-0142</a></span></div>
      </div>
      <header className="site-header">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActivePage("doctors"); }}>
          <span className="brand-mark"><span /></span><span>care<span>point</span><small>HEALTHCARE, MADE HUMAN</small></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activePage === "doctors" ? "nav-link active" : "nav-link"} onClick={() => setActivePage("doctors")}>Find a doctor</button>
          <button className={activePage === "appointments" ? "nav-link active" : "nav-link"} onClick={() => setActivePage("appointments")}>My appointments{confirmedCount > 0 && <span className="nav-count">{confirmedCount}</span>}</button>
          <button className={activePage === "admin" ? "nav-link active" : "nav-link"} onClick={() => setActivePage("admin")}>Clinic admin</button>
        </nav>
        <button className="header-help" onClick={() => setNotice("Our care team is here to help at (212) 555-0142.")}><span className="help-avatar">?</span><span>Need help?<strong>Talk to our team</strong></span></button>
      </header>

      <main>
        {activePage === "doctors" && (
          <>
            <section className="hero">
              <div className="hero-content">
                <div className="hero-kicker"><span /> CARE THAT PUTS YOU FIRST</div>
                <h1>Find the right care.<br /><em>Feel better, sooner.</em></h1>
                <p>Connect with trusted, experienced doctors who are here to listen, help, and make your health a priority.</p>
                <div className="hero-trust"><div className="avatar-stack"><img src={doctors[0].image} alt="" /><img src={doctors[2].image} alt="" /><img src={doctors[1].image} alt="" /></div><span><strong>4.9/5</strong> from 2,000+ happy patients</span></div>
              </div>
              <div className="hero-visual" aria-hidden="true">
                <div className="hero-circle" />
                <img className="hero-doctor-image" src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=850&q=90" alt="" />
                <div className="hero-note"><span className="hero-note-icon"><Icon name="check" size={17} /></span><span><strong>Care you can count on</strong><small>Trusted by your community</small></span></div>
                <div className="hero-sparkle">✳</div>
              </div>
              <div className="hero-bottom-note"><span>✳</span> Good health starts with a good conversation.</div>
            </section>

            <section className="directory-section" id="doctors">
              <div className="section-heading">
                <div><span className="section-eyebrow">YOUR CARE, YOUR WAY</span><h2>Meet our specialists</h2><p>Thoughtful care from doctors who truly care about you.</p></div>
                <button className="text-button" onClick={clearDoctorFilters}>View all doctors <Icon name="arrow" size={16} /></button>
              </div>
              <div className="search-panel">
                <label className="search-field"><Icon name="search" size={19} /><input type="search" placeholder="Search doctor, specialty, or clinic..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search doctors" /></label>
                <label className="specialty-select"><span>Specialty</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)}><option>All specialties</option>{specialties.map((item) => <option key={item}>{item}</option>)}</select><span className="select-chevron"><Icon name="chevron" size={14} /></span></label>
                <label className="availability-toggle"><input type="checkbox" checked={availabilityOnly} onChange={(event) => setAvailabilityOnly(event.target.checked)} /><span className="toggle-track" /><span>Available today</span></label>
              </div>
              <div className="directory-label"><span>{filteredDoctors.length} trusted specialists</span><span>Sorted by patient rating <Icon name="chevron" size={14} /></span></div>
              {filteredDoctors.length ? <div className="doctor-grid">{filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} availableToday={hasAvailabilityToday(doctor)} onProfile={setProfileDoctor} onBook={openBooking} />)}</div> : (
                <div className="empty-state"><span className="empty-icon"><Icon name="search" size={22} /></span><h3>No doctors found</h3><p>Try a different name or specialty, or clear your filters.</p><button className="button button-outline" onClick={clearDoctorFilters}>Clear filters</button></div>
              )}
              <div className="care-banner"><span className="care-banner-icon"><Icon name="shield" size={22} /></span><div><strong>Care that feels personal, every step of the way.</strong><p>Every doctor on Carepoint is carefully vetted and committed to helping you feel your best.</p></div><span className="care-banner-decoration">✳</span></div>
            </section>
          </>
        )}

        {activePage === "appointments" && (
          <section className="dashboard-section">
            <div className="dashboard-title-row"><div><span className="section-eyebrow">YOUR HEALTH, ALL IN ONE PLACE</span><h1>My appointments</h1><p>Keep track of your visits and stay on top of your care.</p></div><button className="button button-primary" onClick={() => setActivePage("doctors")}><Icon name="plus" size={17} /> Book an appointment</button></div>
            <div className="appointment-tabs">{["Upcoming", "Past", "Cancelled"].map((filter) => <button key={filter} className={appointmentFilter === filter ? "appointment-tab active" : "appointment-tab"} onClick={() => setAppointmentFilter(filter)}>{filter}<span>{appointments.filter((item) => matchesAppointmentFilter(item, filter)).length}</span></button>)}</div>
            {visibleAppointments.length ? <div className="appointment-list">{visibleAppointments.map((appointment) => (
              <article className="appointment-card" key={appointment.id}>
                <div className="appointment-date"><span>{formatDate(appointment.date, { month: "short" })}</span><strong>{new Date(`${appointment.date}T12:00:00`).getDate()}</strong><small>{formatDate(appointment.date, { weekday: "short" })}</small></div>
                <img className="appointment-doctor-image" src={appointment.image} alt={appointment.doctorName} />
                <div className="appointment-main"><div className="appointment-doc-heading"><div><h3>{appointment.doctorName}</h3><p>{appointment.specialty}</p></div><span className={`status-badge status-${appointment.status.toLowerCase()}`}>{appointment.status}</span></div><div className="appointment-details"><span><Icon name="clock" size={15} />{appointment.time}</span><span><Icon name="pin" size={15} />{appointment.location}</span></div><div className="appointment-id">Appointment ID: <strong>{appointment.id}</strong></div></div>
                {appointment.status === "Confirmed" && <div className="appointment-actions"><button className="button button-outline button-small" onClick={() => openBooking(doctors.find((doctor) => doctor.id === appointment.doctorId) || doctors[0], appointment)}>Reschedule</button><button className="cancel-link" onClick={() => cancelAppointment(appointment.id)}>Cancel visit</button></div>}
              </article>
            ))}</div> : <div className="empty-state appointment-empty"><span className="empty-icon"><Icon name="calendar" size={22} /></span><h3>{appointmentFilter === "Upcoming" ? "Nothing on your calendar yet" : `No ${appointmentFilter.toLowerCase()} appointments`}</h3><p>{appointmentFilter === "Upcoming" ? "When you book a visit, you’ll find all the details right here." : "Your appointment history will show up here."}</p>{appointmentFilter === "Upcoming" && <button className="button button-primary" onClick={() => setActivePage("doctors")}>Find a doctor <Icon name="arrow" size={16} /></button>}</div>}
          </section>
        )}

        {activePage === "admin" && (
          <section className="dashboard-section admin-section">
            <div className="dashboard-title-row"><div><span className="section-eyebrow">PRACTICE MANAGEMENT</span><h1>Clinic schedule</h1><p>Manage appointments and doctor availability.</p></div><span className="admin-access"><Icon name="shield" size={16} /> Admin workspace</span></div>
            <div className="admin-stats"><div><span>All appointments</span><strong>{appointments.length}</strong><small>Across all doctors</small></div><div><span>Confirmed</span><strong>{appointments.filter((item) => item.status === "Confirmed").length}</strong><small>Awaiting patient visits</small></div><div><span>Completed</span><strong>{appointments.filter((item) => item.status === "Completed").length}</strong><small>Visits completed</small></div><div><span>Blocked slots</span><strong>{blockedSlots.length}</strong><small>Unavailable times</small></div></div>
            <div className="admin-content-grid">
              <div className="admin-panel schedule-panel"><div className="panel-heading"><div><h2>All appointments</h2><p>Grouped by consultation date</p></div><span className="panel-count">{appointments.length} total</span></div>
                {groupedAppointments.length ? <div className="admin-appointment-list">{groupedAppointments.map((appointment, index) => (
                  <div className="admin-appointment" key={appointment.id}>
                    {(index === 0 || groupedAppointments[index - 1].date !== appointment.date) && <div className="admin-date-heading"><Icon name="calendar" size={15} />{formatDate(appointment.date)}</div>}
                    <img src={appointment.image} alt="" /><div className="admin-appointment-info"><strong>{appointment.patient.name}</strong><span>{appointment.doctorName} · {appointment.time}</span><small>{appointment.id}</small></div><span className={`status-badge status-${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    {appointment.status === "Confirmed" && <div className="admin-status-actions"><button title="Mark completed" aria-label={`Mark ${appointment.patient.name}'s appointment completed`} onClick={() => updateAppointmentStatus(appointment.id, "Completed")}><Icon name="check" size={16} /></button><button title="Cancel appointment" aria-label={`Cancel ${appointment.patient.name}'s appointment`} onClick={() => updateAppointmentStatus(appointment.id, "Cancelled")}><Icon name="close" size={16} /></button></div>}
                  </div>
                ))}</div> : <div className="admin-empty">No appointments have been booked yet.</div>}
              </div>
              <aside className="admin-panel block-panel"><div className="panel-heading"><div><h2>Manage availability</h2><p>Block a date or a specific time</p></div></div>
                <form onSubmit={addBlockedSlot} className="block-form">
                  <label>Doctor<select value={adminDoctor} onChange={(event) => setAdminDoctor(event.target.value)}>{doctors.map((doctor) => <option value={doctor.id} key={doctor.id}>{doctor.name}</option>)}</select></label>
                  <label>Date<input type="date" min={today} required value={adminDate} onChange={(event) => setAdminDate(event.target.value)} /></label>
                  <label>Time slot <select value={adminTime} onChange={(event) => setAdminTime(event.target.value)}><option value="">All day</option>{timeSlots.map((time) => <option key={time}>{time}</option>)}</select></label>
                  <button className="button button-primary block-submit" type="submit"><Icon name="plus" size={16} /> Block availability</button>
                </form>
                <div className="blocked-list-heading">Blocked availability <span>{blockedSlots.length}</span></div>
                {blockedSlots.length ? <ul className="blocked-list">{blockedSlots.map((slot) => <li key={slot.key}><span className="blocked-date-icon"><Icon name="calendar" size={15} /></span><span><strong>{formatDate(slot.date, { month: "short", day: "numeric", year: "numeric" })} · {slot.time || "All day"}</strong><small>{slot.doctorName}</small></span><button aria-label={`Remove block on ${slot.date}`} onClick={() => setBlockedSlots((items) => items.filter((item) => item.key !== slot.key))}><Icon name="close" size={15} /></button></li>)}</ul> : <p className="no-blocks">No blocked dates or times. All schedules are open.</p>}
              </aside>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer"><div className="footer-inner"><a className="brand footer-brand" href="#" onClick={(event) => { event.preventDefault(); setActivePage("doctors"); }}><span className="brand-mark"><span /></span><span>care<span>point</span><small>HEALTHCARE, MADE HUMAN</small></span></a><p>Good health starts with a good conversation.</p><span>© {new Date().getFullYear()} Carepoint Health</span></div></footer>
      {notice && <div role="status" className="toast"><span><Icon name="check" size={16} /></span>{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><Icon name="close" size={15} /></button></div>}

      {profileDoctor && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileDoctor(null); }}>
        <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
          <button className="modal-close" onClick={() => setProfileDoctor(null)} aria-label="Close profile"><Icon name="close" /></button>
          <div className={`profile-cover profile-cover-${profileDoctor.color}`}><img src={profileDoctor.image} alt={profileDoctor.name} /></div>
          <div className="profile-content"><span className="section-eyebrow">MEET YOUR DOCTOR</span><div className="profile-title-row"><div><h2 id="profile-title">{profileDoctor.name}</h2><p>{profileDoctor.specialty} · {profileDoctor.degree}</p></div><div className="rating profile-rating"><Icon name="star" size={16} /><strong>{profileDoctor.rating}</strong><small>({profileDoctor.reviews} reviews)</small></div></div>
            <div className="profile-highlights"><span><Icon name="users" size={17} />{profileDoctor.experience}</span><span><Icon name="pin" size={17} />{profileDoctor.location}</span><span><Icon name="clock" size={17} />{profileDoctor.hours}</span></div><div className="profile-address"><Icon name="pin" size={16} /><span><strong>Clinic address</strong>{profileDoctor.address}</span></div>
            <h3>About Dr. {profileDoctor.name.split(" ").slice(1).join(" ")}</h3><p className="profile-bio">{profileDoctor.bio}</p><h3>Education & qualifications</h3><ul className="qualification-list">{profileDoctor.qualifications.map((item) => <li key={item}><Icon name="check" size={15} />{item}</li>)}</ul>
            <div className="profile-book-row"><span>Consultation fee<strong>${profileDoctor.fee}<small> / visit</small></strong></span><button className="button button-primary" onClick={() => openBooking(profileDoctor)}>Book an appointment <Icon name="arrow" size={16} /></button></div>
          </div>
        </section>
      </div>}

      {booking && <div className="modal-backdrop booking-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && bookingStep !== 4) closeBooking(); }}>
        <section className={`booking-modal ${bookingStep === 4 ? "booking-confirmed-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="booking-title">
          {bookingStep !== 4 && <button className="modal-close" onClick={closeBooking} aria-label="Close booking"><Icon name="close" /></button>}
          {bookingStep < 4 ? <>
            <div className="booking-aside"><a className="brand" href="#" onClick={(event) => event.preventDefault()}><span className="brand-mark"><span /></span><span>care<span>point</span><small>HEALTHCARE, MADE HUMAN</small></span></a><div className="booking-doctor"><img src={selectedDoctor.image} alt="" /><div><strong>{selectedDoctor.name}</strong><span>{selectedDoctor.specialty}</span><span className="booking-doctor-rating"><Icon name="star" size={13} /> {selectedDoctor.rating} · ${selectedDoctor.fee}</span></div></div><div className="booking-progress">{["Choose a time", "Your details", "Review"].map((step, index) => <div className={bookingStep >= index + 1 ? "progress-step active" : "progress-step"} key={step}><span>{bookingStep > index + 1 ? <Icon name="check" size={14} /> : index + 1}</span><small>{step}</small></div>)}</div><div className="booking-secure"><Icon name="shield" size={16} /><span><strong>Your information is safe</strong><small>We keep your health details private and secure.</small></span></div></div>
            <div className="booking-main">
              {bookingStep === 1 && <><span className="section-eyebrow">STEP 1 OF 3</span><h2 id="booking-title">{booking.rescheduleId ? "Reschedule your visit" : "Choose a date & time"}</h2><p className="booking-intro">Select a convenient time for your appointment with {selectedDoctor.name}.</p><label className="field-label date-label">Appointment date<input type="date" min={today} value={bookingDate} onChange={(event) => { setBookingDate(event.target.value); setBookingSlot(""); setBookingError(""); }} /></label><div className="slots-heading"><span>Available times</span><small>Local time (Eastern)</small></div><div className="time-grid">{timeSlots.map((time) => { const state = slotState(selectedDoctor.id, bookingDate, time); return <button key={time} type="button" disabled={state !== "available"} className={`time-slot ${bookingSlot === time ? "selected" : ""} ${state !== "available" ? "unavailable" : ""}`} onClick={() => { setBookingSlot(time); setBookingError(""); }}>{time}{state === "booked" && <small>Booked</small>}</button>; })}</div><div className="slot-legend"><span><i /> Available</span><span><i className="legend-booked" /> Booked</span><span><i className="legend-disabled" /> Unavailable</span></div>{bookingError && <p className="form-error" role="alert">{bookingError}</p>}<div className="booking-actions"><button className="button button-primary button-full" onClick={nextBookingStep}>Continue <Icon name="arrow" size={16} /></button></div></>}
              {bookingStep === 2 && <><span className="section-eyebrow">STEP 2 OF 3</span><h2 id="booking-title">A little about you</h2><p className="booking-intro">Please share a few details so your doctor can prepare for your visit.</p><form className="patient-form" onSubmit={reviewBooking}><label className="field-label">Patient name<input required autoComplete="name" placeholder="e.g. Jordan Lee" value={patient.name} onChange={(event) => setPatient({ ...patient, name: event.target.value })} /></label><div className="form-row"><label className="field-label">Age<input required type="number" min="0" max="120" placeholder="Age" value={patient.age} onChange={(event) => setPatient({ ...patient, age: event.target.value })} /></label><label className="field-label">Gender<select required value={patient.gender} onChange={(event) => setPatient({ ...patient, gender: event.target.value })}><option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label></div><label className="field-label">Phone number<input required type="tel" autoComplete="tel" placeholder="(555) 555-0123" value={patient.phone} onChange={(event) => { setPatient({ ...patient, phone: event.target.value }); setBookingError(""); }} /></label><label className="field-label">Email address<input required type="email" autoComplete="email" placeholder="you@example.com" value={patient.email} onChange={(event) => setPatient({ ...patient, email: event.target.value })} /></label><label className="field-label">Reason for visit <span className="optional">(optional)</span><textarea rows="3" placeholder="Briefly describe what you'd like help with..." value={patient.reason} onChange={(event) => setPatient({ ...patient, reason: event.target.value })} /></label>{bookingError && <p className="form-error" role="alert">{bookingError}</p>}<div className="booking-actions"><button type="button" className="button button-outline" onClick={() => setBookingStep(1)}><Icon name="back" size={16} /> Back</button><button className="button button-primary" type="submit">Review appointment <Icon name="arrow" size={16} /></button></div></form></>}
              {bookingStep === 3 && <><span className="section-eyebrow">STEP 3 OF 3</span><h2 id="booking-title">Review your visit</h2><p className="booking-intro">Everything look right? Confirm your details below.</p><div className="review-summary"><div className="review-row"><span>Doctor</span><strong>{selectedDoctor.name}<small>{selectedDoctor.specialty}</small></strong></div><div className="review-row"><span>Date & time</span><strong>{formatDate(bookingDate)}<small>{bookingSlot}</small></strong></div><div className="review-row"><span>Patient</span><strong>{patient.name}<small>Age {patient.age} · {patient.gender}<br />{patient.email} · {patient.phone}</small></strong></div><div className="review-row"><span>Clinic</span><strong>{selectedDoctor.location}<small>{selectedDoctor.address}</small></strong></div><div className="review-total"><span>Consultation fee</span><strong>${selectedDoctor.fee}</strong></div></div>{bookingError && <p className="form-error" role="alert">{bookingError}</p>}<p className="review-note"><Icon name="shield" size={16} /> Your information is encrypted and only shared with your care team.</p><div className="booking-actions"><button className="button button-outline" onClick={() => setBookingStep(2)}><Icon name="back" size={16} /> Edit details</button><button className="button button-primary" onClick={confirmBooking}>Confirm appointment <Icon name="check" size={16} /></button></div></>}
            </div>
          </> : <div className="confirmation-card">
            <button className="modal-close" onClick={() => { setBooking(null); setActivePage("appointments"); }} aria-label="Close confirmation"><Icon name="close" /></button>
            <div className="confirmation-check"><Icon name="check" size={30} /></div><span className="section-eyebrow">YOU'RE IN GOOD HANDS</span><h2 id="booking-title">{booking.rescheduleId ? "Visit rescheduled!" : "Appointment confirmed!"}</h2><p className="confirmation-intro">{booking.rescheduleId ? "Your appointment has been updated. We look forward to seeing you." : `Thanks, ${patient.name.split(" ")[0]}. Your visit is reserved. Keep this confirmation handy.`}</p>
            <div className="confirmation-details"><div className="confirmation-doctor"><img src={confirmedAppointment?.image || selectedDoctor.image} alt="" /><span><strong>{confirmedAppointment?.doctorName || selectedDoctor.name}</strong><small>{confirmedAppointment?.specialty || selectedDoctor.specialty}</small></span><span className="status-badge status-confirmed">Confirmed</span></div><div className="confirmation-detail-grid"><div><small>DATE</small><strong>{formatDate(bookingDate, { month: "long", day: "numeric", year: "numeric" })}</strong></div><div><small>TIME</small><strong>{bookingSlot}</strong></div><div><small>LOCATION</small><strong>{selectedDoctor.location}<small className="confirmation-address">{selectedDoctor.address}</small></strong></div><div><small>CONSULTATION</small><strong>${selectedDoctor.fee}</strong></div></div><div className="confirmation-patient"><span><small>PATIENT</small><strong>{patient.name} · Age {patient.age} · {patient.gender}</strong><small>{patient.email} · {patient.phone}</small>{patient.reason && <small>Reason: {patient.reason}</small>}</span></div><div className="confirmation-id"><span>Appointment ID</span><strong>{confirmedAppointment?.id || booking.rescheduleId}</strong></div></div>
            <div className="confirmation-actions"><button className="button button-outline" onClick={() => window.print()}><Icon name="print" size={16} /> Print</button><button className="button button-outline" onClick={() => downloadSummary(confirmedAppointment || { id: booking.rescheduleId, patient, doctorName: selectedDoctor.name, specialty: selectedDoctor.specialty, date: bookingDate, time: bookingSlot, location: selectedDoctor.location, address: selectedDoctor.address, fee: selectedDoctor.fee })}><Icon name="download" size={16} /> Download</button></div>
            <button className="button button-primary button-full" onClick={() => { setBooking(null); setActivePage("appointments"); }}>Go to my appointments <Icon name="arrow" size={16} /></button>
          </div>}
        </section>
      </div>}
    </div>
  );
}

export default App;
