// ============================================
// 3D Model Gallery - Main Script
// ============================================

class ModelGallery {
    constructor() {
        this.models = [];
        this.categories = [];
        this.tags = [];
        this.filteredModels = [];
        this.activeCategory = 'all';
        this.activeTags = new Set();
        this.sortBy = 'newest';

        this.init();
    }

    async init() {
        this.showLoading(true);
        await this.loadData();
        this.renderFilters();
        this.renderModels();
        this.bindEvents();
        this.initTheme();
        this.showLoading(false);
    }

    async loadData() {
        try {
            const response = await fetch('data/models.json');
            const data = await response.json();
            this.models = data.models;
            this.categories = data.categories;
            this.tags = data.tags;
            this.filteredModels = [...this.models];
        } catch (error) {
            console.error('Failed to load models:', error);
            this.models = [];
            this.filteredModels = [];
        }
    }

    renderFilters() {
        // Category filters
        const categoryContainer = document.getElementById('category-filters');
        categoryContainer.innerHTML = this.categories.map(cat => `
            <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}"
                    data-category="${cat.id}">
                ${cat.nameKo}
            </button>
        `).join('');

        // Tag filters (show top 10)
        const tagContainer = document.getElementById('tag-filters');
        const topTags = this.tags.slice(0, 12);
        tagContainer.innerHTML = topTags.map(tag => `
            <button class="filter-btn" data-tag="${tag}">
                ${tag}
            </button>
        `).join('');
    }

    renderModels() {
        const grid = document.getElementById('models-grid');
        const count = document.getElementById('model-count');

        // Sort models
        this.sortModels();

        count.textContent = this.filteredModels.length;

        if (this.filteredModels.length === 0) {
            grid.innerHTML = `
                <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <h3>모델이 없습니다</h3>
                    <p>필터를 변경해보세요</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredModels.map(model => `
            <div class="model-card" data-id="${model.id}">
                <div class="model-thumbnail">
                    <img src="${model.thumbnail}" alt="${model.name}" loading="lazy">
                    ${model.featured ? '<span class="model-badge">Featured</span>' : ''}
                </div>
                <div class="model-info">
                    <h3 class="model-name">${model.name}</h3>
                    <div class="model-meta">
                        <span>${model.polyCount.toLocaleString()} polys</span>
                        <span>${model.license}</span>
                    </div>
                    <div class="model-tags">
                        ${model.tags.slice(0, 3).map(tag => `
                            <span class="model-tag">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    sortModels() {
        switch (this.sortBy) {
            case 'newest':
                this.filteredModels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                this.filteredModels.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'name':
                this.filteredModels.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    filterModels() {
        this.filteredModels = this.models.filter(model => {
            // Category filter
            if (this.activeCategory !== 'all' && model.category !== this.activeCategory) {
                return false;
            }

            // Tag filter (AND logic)
            if (this.activeTags.size > 0) {
                const hasAllTags = [...this.activeTags].every(tag => model.tags.includes(tag));
                if (!hasAllTags) return false;
            }

            return true;
        });

        this.renderModels();
    }

    openModal(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (!model) return;

        const modal = document.getElementById('viewer-modal');
        const viewer = document.getElementById('model-viewer');
        const nameEl = document.getElementById('detail-name');
        const descEl = document.getElementById('detail-description');
        const polyEl = document.getElementById('detail-poly');
        const licenseEl = document.getElementById('detail-license');
        const tagsEl = document.getElementById('detail-tags');
        const downloadEl = document.getElementById('download-buttons');

        // Set model details
        nameEl.textContent = model.name;
        descEl.textContent = model.description;
        polyEl.textContent = `Poly: ${model.polyCount.toLocaleString()}`;
        licenseEl.textContent = `License: ${model.license}`;

        // Tags
        tagsEl.innerHTML = model.tags.map(tag => `
            <span class="model-tag">${tag}</span>
        `).join('');

        // Download buttons
        const fileTypes = Object.entries(model.files);
        downloadEl.innerHTML = fileTypes.map(([type, url], index) => `
            <a href="${url}" class="download-btn ${index > 0 ? 'secondary' : ''}" download>
                ${type.toUpperCase()} 다운로드
            </a>
        `).join('');

        // Load 3D model (only if GLB exists)
        if (model.files.glb) {
            viewer.src = model.files.glb;
        } else {
            viewer.src = '';
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('viewer-modal');
        const viewer = document.getElementById('model-viewer');

        modal.classList.remove('show');
        viewer.src = '';
        document.body.style.overflow = '';
    }

    bindEvents() {
        // Category filter clicks
        document.getElementById('category-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('#category-filters .filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                this.activeCategory = e.target.dataset.category;
                this.filterModels();
            }
        });

        // Tag filter clicks
        document.getElementById('tag-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                e.target.classList.toggle('active');
                const tag = e.target.dataset.tag;

                if (this.activeTags.has(tag)) {
                    this.activeTags.delete(tag);
                } else {
                    this.activeTags.add(tag);
                }

                this.filterModels();
            }
        });

        // Sort change
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderModels();
        });

        // Model card clicks
        document.getElementById('models-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.model-card');
            if (card) {
                this.openModal(card.dataset.id);
            }
        });

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-backdrop').addEventListener('click', () => {
            this.closeModal();
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const grid = document.getElementById('models-grid');

        if (show) {
            loading.classList.add('show');
            grid.style.display = 'none';
        } else {
            loading.classList.remove('show');
            grid.style.display = 'grid';
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const btn = document.getElementById('theme-toggle');
        btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ModelGallery();
});
