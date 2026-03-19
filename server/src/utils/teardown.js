import { db } from '../config/firebaseAdmin.js';

async function clearSeedData() {
  const collections = ['roles']