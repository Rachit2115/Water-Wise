document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const preloader = document.getElementById("preloader")
    const header = document.getElementById("main-header")
    const menuToggle = document.getElementById("menu-toggle")
    const mobileMenu = document.getElementById("mobile-menu")
    const themeToggle = document.getElementById("theme-toggle")
    const backToTop = document.getElementById("back-to-top")
    const mobileDropdownToggles = document.querySelectorAll(".mobile-dropdown-toggle")
  
    // Water tracker elements
    const activitySelect = document.getElementById("activity")
    const durationGroup = document.getElementById("duration-group")
    const countGroup = document.getElementById("count-group")
    const customGroup = document.getElementById("custom-group")
    const waterUsageForm = document.getElementById("water-usage-form")
    const totalUsageSpan = document.getElementById("total-usage")
    const waterSavedSpan = document.getElementById("water-saved")
    const usageList = document.getElementById("usage-list")
    const meterFill = document.getElementById("meter-fill")
    const comparisonText = document.getElementById("comparison-text")
    const resetUsageBtn = document.getElementById("reset-usage")
    const waterGoalInput = document.getElementById("water-goal")
    const setGoalBtn = document.getElementById("set-goal")
    const goalProgressFill = document.getElementById("goal-progress-fill")
    const goalPercentage = document.getElementById("goal-percentage")
    const goalStatus = document.getElementById("goal-status")
    const formMessage = document.getElementById("form-message")
    const goalMessage = document.getElementById("goal-message")
  
    // Water usage rates (gallons)
    const waterRates = {
      shower: 2.0, // per minute
      bath: 36.0, // per use
      toilet: 1.6, // per flush
      teeth: 1.0, // per minute
      dishes: 4.0, // per minute
      laundry: 25.0, // per load
      drinking: 0.5, // per day
      lawn: 10.0, // per minute
      car: 40.0, // per wash
      other: 1.0, // custom
    }
  
    // State variables
    let totalUsage = 0
    let waterGoal = 50
    let usageHistory = []
  
    // Hide preloader after page loads
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("fade-out")
        setTimeout(() => {
          preloader.style.display = "none"
        }, 500)
      }, 1000)
    })
  
    // Mobile menu toggle
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active")
        this.querySelector("i").classList.toggle("fa-bars")
        this.querySelector("i").classList.toggle("fa-times")
      })
    }
  
    // Mobile dropdown toggles
    mobileDropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const dropdownMenu = this.nextElementSibling
        dropdownMenu.classList.toggle("active")
        this.querySelector("i").classList.toggle("fa-chevron-down")
        this.querySelector("i").classList.toggle("fa-chevron-up")
      })
    })
  
    // Theme toggle (light/dark mode)
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode")
  
        // Update icon
        const icon = this.querySelector("i")
        if (icon.classList.contains("fa-moon")) {
          icon.classList.remove("fa-moon")
          icon.classList.add("fa-sun")
        } else {
          icon.classList.remove("fa-sun")
          icon.classList.add("fa-moon")
        }
  
        // Save preference to localStorage
        const isDarkMode = document.body.classList.contains("dark-mode")
        localStorage.setItem("darkMode", isDarkMode)
      })
  
      // Check for saved theme preference
      const savedDarkMode = localStorage.getItem("darkMode") === "true"
      if (savedDarkMode) {
        document.body.classList.add("dark-mode")
        const icon = themeToggle.querySelector("i")
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
      }
    }
  
    // Back to top button
    window.addEventListener("scroll", () => {
      // Show/hide back to top button
      if (window.pageYOffset > 300) {
        backToTop.classList.add("show")
      } else {
        backToTop.classList.remove("show")
      }
  
      // Header scroll effect
      if (window.pageYOffset > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
  
      // Animate elements on scroll
      animateOnScroll()
    })
  
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }
  
    // Parallax effect
    const parallaxElements = document.querySelectorAll(".parallax")
  
    window.addEventListener("scroll", () => {
      parallaxElements.forEach((element) => {
        const scrollPosition = window.pageYOffset
        const bgElement = element.querySelector(".parallax-bg")
        if (bgElement) {
          bgElement.style.transform = `translateY(${scrollPosition * 0.3}px)`
        }
      })
    })
  
    // Animate elements when they come into view
    function animateOnScroll() {
      const elements = document.querySelectorAll(".animate-on-scroll")
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        const delay = element.getAttribute("data-delay") || 0
  
        // If element is in viewport
        if (elementPosition < windowHeight - 50) {
          setTimeout(() => {
            element.classList.add("active")
          }, delay)
        }
      })
    }
  
    // Trigger once on page load
    setTimeout(animateOnScroll, 100)
  
    // Water tracker functionality
    if (activitySelect) {
      // Show/hide input fields based on selected activity
      activitySelect.addEventListener("change", function () {
        const activity = this.value
  
        // Reset all groups
        durationGroup.style.display = "none"
        countGroup.style.display = "none"
        customGroup.style.display = "none"
  
        // Show appropriate input based on activity
        if (activity === "shower" || activity === "teeth" || activity === "dishes" || activity === "lawn") {
          durationGroup.style.display = "block"
        } else if (activity === "toilet" || activity === "bath" || activity === "laundry" || activity === "car") {
          countGroup.style.display = "block"
        } else if (activity === "other") {
          customGroup.style.display = "block"
        }
      })
  
      // Load saved data from localStorage
      function loadSavedData() {
        const savedDate = localStorage.getItem("waterTrackerDate")
        const currentDate = new Date().toDateString()
  
        // If it's a new day, reset the data
        if (savedDate !== currentDate) {
          resetData()
          localStorage.setItem("waterTrackerDate", currentDate)
          return
        }
  
        // Load data if it's the same day
        const savedUsage = localStorage.getItem("totalWaterUsage")
        const savedGoal = localStorage.getItem("waterGoal")
        const savedHistory = localStorage.getItem("usageHistory")
  
        if (savedUsage) totalUsage = Number.parseFloat(savedUsage)
        if (savedGoal) waterGoal = Number.parseFloat(savedGoal)
        if (savedHistory) usageHistory = JSON.parse(savedHistory)
  
        // Update UI with loaded data
        updateUI()
        renderUsageHistory()
      }
  
      // Save data to localStorage
      function saveData() {
        localStorage.setItem("waterTrackerDate", new Date().toDateString())
        localStorage.setItem("totalWaterUsage", totalUsage)
        localStorage.setItem("waterGoal", waterGoal)
        localStorage.setItem("usageHistory", JSON.stringify(usageHistory))
      }
  
      // Reset all data
      function resetData() {
        totalUsage = 0
        usageHistory = []
        updateUI()
        renderUsageHistory()
        saveData()
      }
  
      // Update UI elements based on current state
      function updateUI() {
        if (!totalUsageSpan) return // Exit if we're not on the tracker page
  
        // Update total usage display
        totalUsageSpan.textContent = totalUsage.toFixed(1)
  
        // Update water saved
        const averageUsage = 100 // Average daily usage in gallons
        const saved = Math.max(0, averageUsage - totalUsage)
        waterSavedSpan.textContent = saved.toFixed(1)
  
        // Update usage meter (max 100 gallons)
        const meterPercentage = Math.min(100, (totalUsage / 100) * 100)
        meterFill.style.width = `${meterPercentage}%`
  
        // Update comparison text
        const usagePercentage = ((totalUsage / 100) * 100).toFixed(1)
        comparisonText.textContent = `That's ${usagePercentage}% of the average daily usage (100 gallons)`
  
        // Update goal progress
        const goalPercentageValue = Math.min(100, (totalUsage / waterGoal) * 100)
        goalProgressFill.style.width = `${goalPercentageValue}%`
        goalPercentage.textContent = `${goalPercentageValue.toFixed(1)}%`
  
        // Update goal message
        if (totalUsage <= waterGoal * 0.5) {
          goalStatus.textContent = "You're doing great! Keep conserving water."
          goalStatus.className = "goal-status success"
        } else if (totalUsage <= waterGoal * 0.8) {
          goalStatus.textContent = "You're on track! Be mindful of your usage."
          goalStatus.className = "goal-status warning"
        } else if (totalUsage <= waterGoal) {
          goalStatus.textContent = "Getting close to your limit! Try to conserve more."
          goalStatus.className = "goal-status warning"
        } else {
          goalStatus.textContent = "You've exceeded your goal. Try to reduce usage tomorrow."
          goalStatus.className = "goal-status danger"
        }
  
        // Update water goal input
        waterGoalInput.value = waterGoal
      }
  
      // Render usage history list
      function renderUsageHistory() {
        if (!usageList) return // Exit if we're not on the tracker page
  
        usageList.innerHTML = ""
  
        if (usageHistory.length === 0) {
          const emptyItem = document.createElement("li")
          emptyItem.textContent = "No water usage recorded yet."
          emptyItem.className = "empty-message"
          usageList.appendChild(emptyItem)
          return
        }
  
        usageHistory.forEach((item, index) => {
          const listItem = document.createElement("li")
  
          const descriptionSpan = document.createElement("span")
          descriptionSpan.textContent = item.description
  
          const amountSpan = document.createElement("span")
          amountSpan.textContent = `${item.amount.toFixed(1)} gal`
          amountSpan.style.fontWeight = "bold"
          amountSpan.style.color = "var(--primary-color)"
  
          const deleteBtn = document.createElement("button")
          deleteBtn.innerHTML = '<i class="fas fa-times"></i>'
          deleteBtn.className = "delete-btn"
  
          deleteBtn.addEventListener("click", () => {
            totalUsage -= item.amount
            usageHistory.splice(index, 1)
            updateUI()
            renderUsageHistory()
            saveData()
          })
  
          listItem.appendChild(descriptionSpan)
          listItem.appendChild(amountSpan)
          listItem.appendChild(deleteBtn)
          usageList.appendChild(listItem)
        })
      }
  
      // Add water usage
      waterUsageForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const activity = activitySelect.value
        let amount = 0
        let description = ""
  
        // Calculate water usage based on activity
        if (activity === "shower" || activity === "teeth" || activity === "dishes" || activity === "lawn") {
          const duration = Number.parseFloat(document.getElementById("duration").value) || 0
          amount = waterRates[activity] * duration
          description = `${activity.charAt(0).toUpperCase() + activity.slice(1)} (${duration} min)`
        } else if (activity === "toilet" || activity === "bath" || activity === "laundry" || activity === "car") {
          const count = Number.parseInt(document.getElementById("count").value) || 0
          amount = waterRates[activity] * count
          description = `${activity.charAt(0).toUpperCase() + activity.slice(1)} (${count} ${count === 1 ? "time" : "times"})`
        } else if (activity === "drinking") {
          amount = waterRates[activity]
          description = "Drinking water"
        } else if (activity === "other") {
          amount = Number.parseFloat(document.getElementById("custom-amount").value) || 0
          description = "Other water usage"
        }
  
        // Add to total and history if amount is valid
        if (amount > 0) {
          totalUsage += amount
          usageHistory.push({
            activity,
            amount,
            description,
            timestamp: new Date().toISOString(),
          })
  
          // Update UI and save data
          updateUI()
          renderUsageHistory()
          saveData()
  
          // Show success message
          formMessage.textContent = `Added ${amount.toFixed(1)} gallons of water usage`
          formMessage.className = "form-message success"
  
          // Clear message after 3 seconds
          setTimeout(() => {
            formMessage.className = "form-message"
          }, 3000)
        }
      })
  
      // Reset usage
      resetUsageBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset today's water usage data?")) {
          resetData()
        }
      })
  
      // Set water goal
      setGoalBtn.addEventListener("click", () => {
        const newGoal = Number.parseFloat(waterGoalInput.value)
        if (newGoal > 0) {
          waterGoal = newGoal
          updateUI()
          saveData()
  
          // Show success message
          goalMessage.textContent = `Goal set to ${waterGoal} gallons per day`
          goalMessage.className = "goal-message success"
  
          // Clear message after 3 seconds
          setTimeout(() => {
            goalMessage.className = "goal-message"
          }, 3000)
        } else {
          // Show error message
          goalMessage.textContent = "Please enter a valid goal amount"
          goalMessage.className = "goal-message error"
  
          // Clear message after 3 seconds
          setTimeout(() => {
            goalMessage.className = "goal-message"
          }, 3000)
        }
      })
  
      // Initialize the app
      loadSavedData()
  
      // Trigger change event to set initial form state
      activitySelect.dispatchEvent(new Event("change"))
    }
  })
  
  