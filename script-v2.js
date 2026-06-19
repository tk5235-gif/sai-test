document.addEventListener("DOMContentLoaded", () => {
    // ── 1. Header scroll effect (is-scrolled) ──
    const handleScroll = () => {
        // 50px以上スクロールしたら body に is-scrolled クラスをトグル
        document.body.classList.toggle('is-scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期チェック


    // ── 2. Intersection Observer for fade-in animations (js-inview) ──
    const inviewElements = document.querySelectorAll('.js-inview');
    if (inviewElements.length > 0) {
        const inviewObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-show');
                    // 一度表示されたら監視を解除する場合は unobserve する
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px', // 少し早めに検知
            threshold: 0.1
        });
        inviewElements.forEach(el => inviewObserver.observe(el));
    }


    // ── 3. Hamburger Menu Open/Close ──
    const navTrigger = document.querySelector('.js-nav-trigger');
    const navTarget = document.querySelector('.js-nav-target');

    if (navTrigger && navTarget) {
        const openMenu = () => {
            navTrigger.classList.add('is-open');
            navTrigger.setAttribute('aria-expanded', 'true');
            navTarget.classList.add('is-open');
            navTarget.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeMenu = () => {
            navTrigger.classList.remove('is-open');
            navTrigger.setAttribute('aria-expanded', 'false');
            navTarget.classList.remove('is-open');
            navTarget.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        navTrigger.addEventListener('click', () => {
            const isOpen = navTrigger.classList.contains('is-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // ハンバーガーメニュー内のリンクをクリックした時も閉じる
        const menuLinks = navTarget.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }


    // ── 4. Hamburger Menu Accordion for Entry Buttons ──
    const accordionButtons = document.querySelectorAll('.hamburger-entry > ul > li > button');
    accordionButtons.forEach(btn => {
        const subList = btn.nextElementSibling;
        if (subList) {
            // 初期状態はCSSに定義がないため、JSで非表示にスタイル制御
            subList.style.display = 'none';
            subList.style.overflow = 'hidden';
            subList.style.transition = 'all 0.3s ease';

            btn.addEventListener('click', () => {
                const isCollapsed = subList.style.display === 'none';
                if (isCollapsed) {
                    subList.style.display = 'block';
                    btn.classList.add('is-active');
                } else {
                    subList.style.display = 'none';
                    btn.classList.remove('is-active');
                }
            });
        }
    });


    // ── 5. Swiper.js Initialization ──

    // A. KV Marquee Slider Options (等速シームレスループ)
    const getMarqueeOptions = (reverse = false) => {
        return {
            loop: true,
            speed: 8000, // スライドの流れる速度
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: reverse
            },
            slidesPerView: 'auto',
            allowTouchMove: false,
            freeMode: {
                enabled: true,
                momentum: false,
            }
        };
    };

    // SP用 KVスライダー
    if (document.querySelector('.js-kv-swiper01')) new Swiper('.js-kv-swiper01', getMarqueeOptions(false));
    if (document.querySelector('.js-kv-swiper02')) new Swiper('.js-kv-swiper02', getMarqueeOptions(true)); // 逆方向
    if (document.querySelector('.js-kv-swiper04')) new Swiper('.js-kv-swiper04', getMarqueeOptions(false));
    if (document.querySelector('.js-kv-swiper05')) new Swiper('.js-kv-swiper05', getMarqueeOptions(true)); // 逆方向

    // PC用 KVスライダー
    if (document.querySelector('.js-kv-swiper03')) new Swiper('.js-kv-swiper03', getMarqueeOptions(false));
    if (document.querySelector('.js-kv-swiper06')) new Swiper('.js-kv-swiper06', getMarqueeOptions(true)); // 逆方向

    // フッター手前 採用イメージスライダー
    if (document.querySelector('.js-recruit-swiper')) {
        new Swiper('.js-recruit-swiper', {
            loop: true,
            speed: 12000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            slidesPerView: 'auto',
            allowTouchMove: false,
            freeMode: {
                enabled: true,
                momentum: false,
            }
        });
    }

    // B. PEOPLE Swiper (社員カルーセル ＋ 円形プログレスバー)
    const progressCircle = document.querySelector('.circle-progress .progress');
    const bgCircle = document.querySelector('.circle-progress .bg');
    const totalLength = 125.66; // 2 * Math.PI * 20 (半径r=20の円周)

    // プログレスバーの初期スタイル適用
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${totalLength}`;
        progressCircle.style.strokeDashoffset = `${totalLength}`;
        progressCircle.style.stroke = '#cd1432'; // ORIX Red
        progressCircle.style.strokeWidth = '2px';
        progressCircle.style.fill = 'transparent';
        progressCircle.style.transition = 'stroke-dashoffset 0.3s ease';
    }
    if (bgCircle) {
        bgCircle.style.stroke = 'rgba(255, 255, 255, 0.15)';
        bgCircle.style.strokeWidth = '2px';
        bgCircle.style.fill = 'transparent';
    }

    const updatePeopleProgress = (swiper) => {
        if (!progressCircle) return;
        // スライドの総数と現在のアクティブインデックスを取得
        // slidesPerViewがautoなので、最大スクロール可能インデックス（snapGridの長さ）を基準にする
        const totalSnaps = swiper.snapGrid.length;
        const currentSnap = swiper.snapIndex;
        
        // 進捗率 (0.0 〜 1.0)
        let ratio = 0;
        if (totalSnaps > 1) {
            ratio = currentSnap / (totalSnaps - 1);
        } else {
            ratio = 1;
        }

        // stroke-dashoffset の計算 (1.0のときoffset=0, 0.0のときoffset=totalLength)
        const offset = totalLength - (ratio * totalLength);
        progressCircle.style.strokeDashoffset = `${offset}`;
    };

    if (document.querySelector('.js-swiper-people')) {
        const peopleSwiper = new Swiper('.js-swiper-people', {
            slidesPerView: 'auto',
            spaceBetween: 24,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
                formatFractionCurrent: (number) => ('0' + number).slice(-2),
                formatFractionTotal: (number) => ('0' + number).slice(-2),
            },
            on: {
                init: function() {
                    updatePeopleProgress(this);
                },
                slideChange: function() {
                    updatePeopleProgress(this);
                },
                resize: function() {
                    updatePeopleProgress(this);
                }
            }
        });
    }

    // ── 6. In-browser WYSIWYG Editing Mode (Simplified) ──

    // 上書き保存 (Save) 機能のイベント
    const btnSaveEdit = document.getElementById('btn-save-edit');
    if (btnSaveEdit) {
        btnSaveEdit.addEventListener('click', () => {
            btnSaveEdit.disabled = true;
            btnSaveEdit.textContent = '保存中...';

            try {
                // 1. ドキュメント要素の複製を作成
                const docClone = document.documentElement.cloneNode(true);
                
                // 2. 編集用のボディクラスを複製から削除（初期状態に戻す）
                const body = docClone.querySelector('body');
                if (body) {
                    body.classList.remove('is-editing-mode');
                    body.classList.remove('is-scrolled');
                }
                
                // 3. 一時的に無効化していたaタグのリンクを復元
                docClone.querySelectorAll('a').forEach(a => {
                    if (a.dataset.oldHref) {
                        a.setAttribute('href', a.dataset.oldHref);
                        a.removeAttribute('data-old-href');
                    }
                });

                // HTML全体を結合
                const finalHTML = '<!DOCTYPE html>\n<html lang="ja">' + docClone.innerHTML + '\n</html>';

                // 4. 自作のサーバー(/save)にPOST送信して上書き保存
                fetch('/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8'
                    },
                    body: finalHTML
                })
                .then(response => response.json())
                .then(data => {
                    btnSaveEdit.disabled = false;
                    if (data.success) {
                        btnSaveEdit.textContent = '💾 保存完了！';
                        btnSaveEdit.style.background = '#38a169'; // 緑
                        alert('ローカルの index.html ファイルを直接上書き保存しました！');
                        setTimeout(() => {
                            btnSaveEdit.textContent = '💾 変更を上書き保存';
                            btnSaveEdit.style.background = '#2f855a'; // 元の緑
                        }, 2500);
                    } else {
                        throw new Error(data.message || 'Unknown server error');
                    }
                })
                .catch(err => {
                    btnSaveEdit.disabled = false;
                    btnSaveEdit.textContent = '💾 保存失敗';
                    btnSaveEdit.style.background = '#e53e3e'; // 赤
                    alert('保存に失敗しました。ローカルサーバーが起動しているか確認してください。\nError: ' + err.message);
                });
            } catch (err) {
                btnSaveEdit.disabled = false;
                btnSaveEdit.textContent = '💾 エラー発生';
                alert('HTMLの書き出し中にエラーが発生しました。\nError: ' + err.message);
            }
        });
    }
});
