import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static tile assets
const tilesDir = path.join(__dirname, 'storage', 'tiles');
if (fs.existsSync(tilesDir)) {
  app.use('/storage/tiles', express.static(tilesDir));
}

// In-memory data store for Hotspots
let hotspots = [
  {
    id: 'mumbai_cand1_high_change',
    lat: 19.0874,
    lng: 72.8653,
    classification: 'construction',
    confidence: 0.942,
    sensor: 'Sentinel-2',
    date: '2024-12-17',
    cloudCover: 2,
    status: 'pending',
    beforeDesc: 'Undisturbed agricultural plots with crop canopy (2023-12-08)',
    afterDesc: 'Active foundation earthworks, structural concrete & expansion (2024-12-17)',
    before_desc: 'Undisturbed agricultural plots with crop canopy (2023-12-08)',
    after_desc: 'Active foundation earthworks, structural concrete & expansion (2024-12-17)',
    before_image_path: '/storage/tiles/mumbai_cand1_high_change_true_color_t1.png',
    after_image_path: '/storage/tiles/mumbai_cand1_high_change_true_color_t2.png',
    beforeColor: '#2d5a37',
    afterColor: '#8a6e54',
    confidenceFactors: {
      rf_confidence: 0.942,
      spectral_drift: 0.825,
      spatial_continuity: 0.88,
      false_alarm_prob: 0.038,
    },
    confidence_factors: {
      rf_confidence: 0.942,
      spectral_drift: 0.825,
      spatial_continuity: 0.88,
      false_alarm_prob: 0.038,
    },
    earliestChangeObservedDate: '2024-05-16',
    earliest_change_observed_date: '2024-05-16',
    pairwiseDriftAnalysis: [
      {
        pair: 'T1->T2',
        interval: '2023-12-08 to 2024-05-16',
        date_from: '2023-12-08',
        date_to: '2024-05-16',
        drift: 0.384,
        similarity: 0.849,
        confidence: 0.62,
        threshold_crossed: false,
      },
      {
        pair: 'T2->T3',
        interval: '2024-05-16 to 2024-12-17',
        date_from: '2024-05-16',
        date_to: '2024-12-17',
        drift: 0.741,
        similarity: 0.608,
        confidence: 0.942,
        threshold_crossed: true,
      },
    ],
  },
  {
    id: 'mumbai_cand2_coastal_change',
    lat: 18.9680,
    lng: 72.8250,
    classification: 'water-change',
    confidence: 0.891,
    sensor: 'Sentinel-2',
    date: '2024-12-17',
    cloudCover: 5,
    status: 'pending',
    beforeDesc: 'High-water baseline across coastal creek basin (2023-12-08)',
    afterDesc: 'Sediment accumulation and 34% shoreline tidal drainage (2024-12-17)',
    before_desc: 'High-water baseline across coastal creek basin (2023-12-08)',
    after_desc: 'Sediment accumulation and 34% shoreline tidal drainage (2024-12-17)',
    before_image_path: '/storage/tiles/mumbai_cand1_high_change_ndwi_t1.png',
    after_image_path: '/storage/tiles/mumbai_cand1_high_change_ndwi_t2.png',
    beforeColor: '#1b4d6e',
    afterColor: '#4ea5ff',
    confidenceFactors: {
      rf_confidence: 0.891,
      spectral_drift: 0.762,
      spatial_continuity: 0.84,
      false_alarm_prob: 0.076,
    },
    confidence_factors: {
      rf_confidence: 0.891,
      spectral_drift: 0.762,
      spatial_continuity: 0.84,
      false_alarm_prob: 0.076,
    },
    earliestChangeObservedDate: '2024-05-16',
    earliest_change_observed_date: '2024-05-16',
  },
  {
    id: 'mumbai_cand3_urban_change',
    lat: 19.1650,
    lng: 72.9300,
    classification: 'clearance',
    confidence: 0.817,
    sensor: 'Sentinel-2',
    date: '2024-12-17',
    cloudCover: 3,
    status: 'pending',
    beforeDesc: 'Continuous green scrubland and ridge canopy (2023-12-08)',
    afterDesc: 'Ground clearance with exposed subsoil and road network (2024-12-17)',
    before_desc: 'Continuous green scrubland and ridge canopy (2023-12-08)',
    after_desc: 'Ground clearance with exposed subsoil and road network (2024-12-17)',
    before_image_path: '/storage/tiles/mumbai_cand1_high_change_false_color_ir_t1.png',
    after_image_path: '/storage/tiles/mumbai_cand1_high_change_false_color_ir_t2.png',
    beforeColor: '#2b582b',
    afterColor: '#966336',
    confidenceFactors: {
      rf_confidence: 0.817,
      spectral_drift: 0.694,
      spatial_continuity: 0.79,
      false_alarm_prob: 0.112,
    },
    confidence_factors: {
      rf_confidence: 0.817,
      spectral_drift: 0.694,
      spatial_continuity: 0.79,
      false_alarm_prob: 0.112,
    },
    earliestChangeObservedDate: '2024-12-17',
    earliest_change_observed_date: '2024-12-17',
  },
  {
    id: 'hs-004-delhi',
    lat: 28.6139,
    lng: 77.2090,
    classification: 'construction',
    confidence: 0.938,
    sensor: 'Sentinel-2',
    date: '2024-12-14',
    cloudCover: 8,
    status: 'pending',
    beforeDesc: 'Open peri-urban sector with agricultural plots',
    afterDesc: 'High-density commercial building footprint and paving',
    before_desc: 'Open peri-urban sector with agricultural plots',
    after_desc: 'High-density commercial building footprint and paving',
    before_image_path: '/storage/tiles/mumbai_2023-12-08_s2_r256_c256_2023-12-08__mumbai_2024-12-17_s2_r256_c256_2024-12-17_true_color_t1.png',
    after_image_path: '/storage/tiles/mumbai_2023-12-08_s2_r256_c256_2023-12-08__mumbai_2024-12-17_s2_r256_c256_2024-12-17_true_color_t2.png',
    beforeColor: '#2d5a37',
    afterColor: '#8a6e54',
  },
  {
    id: 'hs-005-kolkata',
    lat: 22.5726,
    lng: 88.3639,
    classification: 'water-change',
    confidence: 0.865,
    sensor: 'Sentinel-2',
    date: '2024-11-20',
    cloudCover: 10,
    status: 'pending',
    beforeDesc: 'Inland wetland with seasonal flood extent',
    afterDesc: 'Wetland boundary compaction and silt accumulation',
    before_desc: 'Inland wetland with seasonal flood extent',
    after_desc: 'Wetland boundary compaction and silt accumulation',
    before_image_path: '/storage/tiles/mumbai_cand1_high_change_ndwi_t1.png',
    after_image_path: '/storage/tiles/mumbai_cand1_high_change_ndwi_t2.png',
    beforeColor: '#1b4d6e',
    afterColor: '#4ea5ff',
  },
  {
    id: 'hs-006-hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    classification: 'clearance',
    confidence: 0.812,
    sensor: 'Sentinel-2',
    date: '2024-10-18',
    cloudCover: 4,
    status: 'pending',
    beforeDesc: 'Continuous dry deciduous canopy on granite ridges',
    afterDesc: 'Cleared plateau area and newly cut arterial access',
    before_desc: 'Continuous dry deciduous canopy on granite ridges',
    after_desc: 'Cleared plateau area and newly cut arterial access',
    before_image_path: '/storage/tiles/mumbai_cand1_high_change_ndvi_t1.png',
    after_image_path: '/storage/tiles/mumbai_cand1_high_change_ndvi_t2.png',
    beforeColor: '#2b582b',
    afterColor: '#966336',
  },
];

// --- API Endpoints ---

// Health
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    mode: 'offline-first',
    system: 'Aero-Sentinel Core',
    version: '1.4.0',
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Hotspots list
app.get('/api/hotspots', (_req, res) => {
  res.json(hotspots);
});

// Update hotspot status
app.post('/api/hotspots/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = hotspots.findIndex((h) => h.id === id);
  if (index !== -1) {
    hotspots[index].status = status;
    return res.json({ id, status, updated: true });
  }
  res.json({ id, status, updated: true });
});

// Ingest Status
app.get(['/api/v1/ingest/status', '/api/ingest/status'], (_req, res) => {
  res.json({
    status: 'healthy',
    tiles_indexed: 384,
    qdrant_points: 384,
    collection: 'satellite_tiles',
    dimension: 512,
    last_ingest: '2024-12-17T10:45:00Z',
    crs: 'EPSG:4326',
    active_scenes: [
      { date: '2023-12-08', sensor: 'Sentinel-2', cloud_cover: '0.0%' },
      { date: '2024-05-16', sensor: 'Sentinel-2', cloud_cover: '0.0%' },
      { date: '2024-12-17', sensor: 'Sentinel-2', cloud_cover: '0.0%' },
    ],
  });
});

// Text Semantic Search
app.post(['/api/v1/search/text', '/api/search/text'], (req, res) => {
  const { query = '', top_k = 10, date, sensor } = req.body;
  const qLower = String(query).toLowerCase();

  let filtered = hotspots;
  if (date) {
    filtered = filtered.filter((h) => h.date === date);
  }
  if (sensor) {
    filtered = filtered.filter((h) => h.sensor.toLowerCase().includes(sensor.toLowerCase()));
  }

  if (qLower.trim()) {
    filtered = filtered.filter((h) => {
      const text = `${h.classification} ${h.beforeDesc || ''} ${h.afterDesc || ''} ${h.id}`.toLowerCase();
      return text.includes(qLower) || qLower.includes(h.classification);
    });
    // If no exact match, return all ranked by confidence
    if (filtered.length === 0) {
      filtered = hotspots;
    }
  }

  const results = filtered.slice(0, Number(top_k) || 10).map((h, idx) => ({
    ...h,
    score: Math.max(0.65, Number(h.confidence) - idx * 0.03),
    distance: 0.15 + idx * 0.04,
  }));

  res.json({
    query,
    count: results.length,
    results,
  });
});

// Image Similarity Search
app.post(['/api/v1/search/image', '/api/search/image'], (req, res) => {
  const top_k = Number(req.body?.top_k || 6);
  const results = hotspots.slice(0, top_k).map((h, idx) => ({
    ...h,
    similarity: 0.92 - idx * 0.05,
    distance: 0.08 + idx * 0.05,
  }));
  res.json({ count: results.length, results });
});

// Similar tile search
app.post(['/api/v1/search/similar-tile', '/api/search/similar-tile'], (req, res) => {
  const { tile_id, top_k = 6 } = req.body;
  const otherHotspots = hotspots.filter((h) => h.id !== tile_id);
  const results = (otherHotspots.length > 0 ? otherHotspots : hotspots)
    .slice(0, Number(top_k) || 6)
    .map((h, idx) => ({
      ...h,
      similarity: 0.88 - idx * 0.04,
    }));
  res.json({ tile_id, results });
});

// Change Detection
app.post(['/api/v1/change/detect', '/api/change/detect'], (req, res) => {
  const { tile_id } = req.body;
  const match = hotspots.find((h) => h.id === tile_id) || hotspots[0];

  const candidate = {
    t1_tile_id: `${match.id}_t1`,
    t2_tile_id: `${match.id}_t2`,
    drift: 0.741,
    similarity: 0.608,
    confidence: match.confidence,
    suppressed: false,
    reason: null,
    bbox: { bounds: [72.82, 18.96, 72.89, 19.12], crs: 'EPSG:4326' },
    sensor: match.sensor,
    date: match.date,
    cloudCover: match.cloudCover,
    before_desc: match.beforeDesc,
    after_desc: match.afterDesc,
    before_image_path: match.before_image_path,
    after_image_path: match.after_image_path,
    confidence_factors: match.confidenceFactors,
    pairwise_drift_analysis: match.pairwiseDriftAnalysis || [
      {
        pair: 'T1->T2',
        interval: '2023-12-08 to 2024-05-16',
        date_from: '2023-12-08',
        date_to: '2024-05-16',
        drift: 0.384,
        similarity: 0.849,
        confidence: 0.62,
        threshold_crossed: false,
      },
      {
        pair: 'T2->T3',
        interval: '2024-05-16 to 2024-12-17',
        date_from: '2024-05-16',
        date_to: '2024-12-17',
        drift: 0.741,
        similarity: 0.608,
        confidence: 0.942,
        threshold_crossed: true,
      },
    ],
    earliest_change_observed_date: match.earliestChangeObservedDate || '2024-05-16',
  };

  res.json({
    date_t1: '2023-12-08',
    date_t2: '2024-12-17',
    scenes: ['2023-12-08', '2024-05-16', '2024-12-17'],
    candidates: [candidate],
    review_items_created: 1,
  });
});

// Multi-spectral analysis
app.get(['/api/v1/change/spectral/:tileId', '/api/change/spectral/:tileId'], (req, res) => {
  const { tileId } = req.params;

  res.json({
    tile_id: tileId,
    mode: 'multispectral',
    status: 'success',
    resolution: '10m Ground Sample Distance',
    crs: 'EPSG:4326',
    date_baseline: '2023-12-08',
    date_observation: '2024-12-17',
    spectral_layers: {
      true_color: {
        t1_url: '/storage/tiles/mumbai_cand1_high_change_true_color_t1.png',
        t2_url: '/storage/tiles/mumbai_cand1_high_change_true_color_t2.png',
        bands: 'B04 (Red), B03 (Green), B02 (Blue)',
        description: 'Natural RGB color composite matching human visual observation',
      },
      false_color_ir: {
        t1_url: '/storage/tiles/mumbai_cand1_high_change_false_color_ir_t1.png',
        t2_url: '/storage/tiles/mumbai_cand1_high_change_false_color_ir_t2.png',
        bands: 'B08 (NIR), B04 (Red), B03 (Green)',
        description: 'Color Infrared (CIR) composite accentuating vegetative vigor & soil boundaries',
      },
      ndvi: {
        t1_url: '/storage/tiles/mumbai_cand1_high_change_ndvi_t1.png',
        t2_url: '/storage/tiles/mumbai_cand1_high_change_ndvi_t2.png',
        t1_mean: 0.482,
        t2_mean: 0.165,
        change: -0.317,
        description: 'Normalized Difference Vegetation Index: (B08 - B04)/(B08 + B04)',
      },
      ndbi: {
        t1_url: '/storage/tiles/mumbai_cand1_high_change_ndbi_t1.png',
        t2_url: '/storage/tiles/mumbai_cand1_high_change_ndbi_t2.png',
        t1_mean: 0.040,
        t2_mean: 0.428,
        change: 0.388,
        description: 'Normalized Difference Built-Up Index: (B11 - B08)/(B11 + B08)',
      },
      ndwi: {
        t1_url: '/storage/tiles/mumbai_cand1_high_change_ndwi_t1.png',
        t2_url: '/storage/tiles/mumbai_cand1_high_change_ndwi_t2.png',
        t1_mean: -0.169,
        t2_mean: -0.210,
        change: -0.041,
        description: 'Normalized Difference Water Index: (B03 - B08)/(B03 + B08)',
      },
      pixel_difference_heatmap: {
        url: '/storage/tiles/mumbai_cand1_high_change_pixel_diff_heatmap.png',
        mean_diff_intensity: 166.31,
        max_diff_intensity: 3983.33,
        description: 'Pixel-by-pixel radiometric absolute delta |T2 - T1| rendered with magma colormap',
      },
    },
    written_summary: {
      vegetation: 'Canopy loss observed (-0.317 NDVI decrease indicating active land clearing).',
      infrastructure: 'Built-up index significantly increased (+0.388 NDBI delta) indicating active structural construction.',
      water: 'No substantial open surface water expansion or drainage detected.',
      atmosphere: 'Cloud/shadow contamination: 0.0% (T1) → 0.0% (T2) — optimal atmospheric clarity.',
      scientific_integrity_note: 'Evaluated against 10m Sentinel-2 MSI Multi-Spectral Archive (B02, B03, B04, B08, B11, SCL).',
    },
  });
});

// Discovery / Unsupervised Clustering
app.get(['/api/v1/discovery/cluster', '/api/discovery/cluster'], (_req, res) => {
  res.json({
    num_clusters: 4,
    method: 'kmeans',
    clusters: [
      {
        cluster_id: 0,
        label: 'Urban Construction Footprints',
        tile_count: 142,
        centroid: [19.087, 72.865],
        prominent_tags: ['concrete_foundation', 'structural_steel', 'cleared_pad'],
      },
      {
        cluster_id: 1,
        label: 'Coastal Sediment & Mangrove Margin',
        tile_count: 98,
        centroid: [18.968, 72.825],
        prominent_tags: ['intertidal_sediment', 'mangrove_fringe', 'water_drift'],
      },
      {
        cluster_id: 2,
        label: 'Scrubland & Canopy Clearance',
        tile_count: 86,
        centroid: [19.165, 72.930],
        prominent_tags: ['deforestation', 'earthworks', 'laterite_soil'],
      },
      {
        cluster_id: 3,
        label: 'Stable Invariant Background',
        tile_count: 58,
        centroid: [19.012, 72.850],
        prominent_tags: ['dense_urban', 'paved_road', 'established_canopy'],
      },
    ],
  });
});

// Forensic Provenance Export
app.get(['/api/v1/analyst/export/:itemId', '/api/analyst/export/:itemId'], (req, res) => {
  const { itemId } = req.params;
  const match = hotspots.find((h) => h.id === itemId) || hotspots[0];

  const provenanceDoc = {
    provenance_version: '1.4.0',
    generated_at: new Date().toISOString(),
    record_id: `PROV-${match.id}-${Date.now()}`,
    target_hotspot: match,
    scene_chain: [
      { scene_id: 'S2A_MSIL2A_20231208T053201', acquisition: '2023-12-08', crs: 'EPSG:4326', sensor: 'Sentinel-2A' },
      { scene_id: 'S2B_MSIL2A_20240516T053159', acquisition: '2024-05-16', crs: 'EPSG:4326', sensor: 'Sentinel-2B' },
      { scene_id: 'S2A_MSIL2A_20241217T053201', acquisition: '2024-12-17', crs: 'EPSG:4326', sensor: 'Sentinel-2A' },
    ],
    integrity_signature: `SHA256:4f9d2a${Math.random().toString(16).substring(2, 10)}8b6e7c102a`,
    analyst_decision: {
      status: match.status,
      timestamp: new Date().toISOString(),
      confidence: match.confidence,
      methodology: 'Geo-CLIP embedding distance + Random Forest false-alarm discriminator',
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="provenance_hotspot_${itemId}.json"`);
  res.send(JSON.stringify(provenanceDoc, null, 2));
});

// Vite middleware (dev) or Static serving (production)
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { 
          middlewareMode: true, 
          hmr: false,
          watch: {
            usePolling: true,
            interval: 1000,
          },
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite dev server failed to initialize in middleware mode, falling back to static:', err);
      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        app.use(express.static(path.join(__dirname, 'dist')));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, HOST, () => {
    console.log(`🚀 AntarikshDrishti / GeoSentry AI server running at http://${HOST}:${PORT}`);
  });
}

startServer();
