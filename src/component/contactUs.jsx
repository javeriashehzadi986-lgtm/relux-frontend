import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./contactUs.css";

const CONTACT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDo_c6ODw6-k_puKwtNgLWB0XJZiWiLiDLZXwYOrsE2pD4-dpZhMVuxiBrZQbiKwn33dK7SCt3CUfYuccgUWB4qZ-tLF3Q3rMGUlKlJx_pjNSdtLXLvYJGMI-lnJdIxUqri14vZyuh8NbIhETj09rWSDY-jpKs3FUuEkZMB89fO-wWNqgEkfqkhHNGLwcxRDWw30YIYbNnatUmBdxnpB1fd6Ut6tKDHZF0gaJZ_HDibTYdAfjm4peVix_iBk6rElYRxUP6NegVcX6s";

function ContactUs() {
  const [submitState, setSubmitState] = useState("idle");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitState !== "idle") return;

    const form = event.currentTarget;
    setSubmitState("sending");

    window.setTimeout(() => {
      setSubmitState("sent");
      form.reset();

      window.setTimeout(() => {
        setSubmitState("idle");
      }, 3000);
    }, 1200);
  };

  const buttonLabel =
    submitState === "sending"
      ? "Sending..."
      : submitState === "sent"
        ? "Message Sent"
        : "Send Message";

  return (
    <div className="contact-page">
      <header className="contact-brand-header">
        <Link to="/home" className="contact-logo">
          Relux Hub
        </Link>
      </header>

      <main className="contact-main">
        <section className="contact-hero">
          <div className="contact-hero-inner">
            <h1 className="contact-hero-title">Contact Us</h1>
            <p className="contact-hero-desc">
              Whether you have a question about a garment or need assistance with
              a rental, our team is here to ensure your sustainable fashion
              journey is seamless.
            </p>
          </div>
        </section>

        <div className="contact-content">
          <aside className="contact-info">
            <div className="contact-image-wrap">
              <img
                className="contact-image"
                src={CONTACT_IMAGE}
                alt="Soft cream and mint green textile texture"
              />
            </div>
          </aside>

          <div className="contact-form-wrap">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-label" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="contact-input"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Evelyn Harper"
                    required
                    disabled={submitState !== "idle"}
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="contact-input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="evelyn@example.com"
                    required
                    disabled={submitState !== "idle"}
                  />
                </div>
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  className="contact-input contact-textarea"
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  rows={6}
                  required
                  disabled={submitState !== "idle"}
                />
              </div>
              <div className="contact-submit-wrap">
                <Button
                  type="submit"
                  variant="default"
                  className={`contact-submit-btn ${submitState === "sent" ? "contact-submit-btn--sent" : ""} ${submitState === "sending" ? "contact-submit-btn--sending" : ""}`}
                  disabled={submitState !== "idle"}
                >
                  {buttonLabel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;
