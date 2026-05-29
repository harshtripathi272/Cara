import React from "react";
import Link from "next/link";
import { Mail, Globe, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__brand">CARA</div>
          <p className="footer__description">
            Your destination for premium fitness, lifestyle, and wellness
            products. We curate the best from top brands so you can shop with
            confidence.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="Instagram">
              <Heart size={16} />
            </a>
            <a href="#" className="footer__social" aria-label="Twitter">
              <ExternalLink size={16} />
            </a>
            <a href="#" className="footer__social" aria-label="YouTube">
              <Globe size={16} />
            </a>
            <a href="#" className="footer__social" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer__heading">Help</h4>
          <div className="footer__links">
            <Link href="#" className="footer__link">FAQ</Link>
            <Link href="#" className="footer__link">Delivery Information</Link>
            <Link href="#" className="footer__link">Returns Policy</Link>
            <Link href="#" className="footer__link">Contact Us</Link>
            <Link href="#" className="footer__link">Size Guide</Link>
          </div>
        </div>

        <div>
          <h4 className="footer__heading">My Account</h4>
          <div className="footer__links">
            <Link href="#" className="footer__link">Sign In</Link>
            <Link href="#" className="footer__link">Register</Link>
            <Link href="#" className="footer__link">Order History</Link>
            <Link href="#" className="footer__link">Wishlist</Link>
            <Link href="#" className="footer__link">Track Order</Link>
          </div>
        </div>

        <div>
          <h4 className="footer__heading">About</h4>
          <div className="footer__links">
            <Link href="#" className="footer__link">About CARA</Link>
            <Link href="#" className="footer__link">Careers</Link>
            <Link href="#" className="footer__link">Privacy Policy</Link>
            <Link href="#" className="footer__link">Terms & Conditions</Link>
            <Link href="#" className="footer__link">Sustainability</Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} CARA. All rights reserved.</span>
        <span>Designed with care for fitness enthusiasts worldwide.</span>
      </div>
    </footer>
  );
}
