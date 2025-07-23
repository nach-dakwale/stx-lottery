;; STX Stacking Lottery Smart Contract
;; Simple contract that automatically handles STX stacking and tracks participants
;; Winner selection and rewards distribution handled off-chain

(define-constant CONTRACT_OWNER tx-sender)
(define-constant MIN_STACK_AMOUNT u10000000) ;; 10 STX minimum

;; Simple data structures
(define-data-var current-pox-cycle uint u0)
(define-data-var is-active bool false)

;; Track participants for current cycle
(define-map participants principal (tuple
  (amount uint)
  (entry-block uint)
))

;; Track all historical winners (for transparency)
(define-map winners principal (tuple
  (pox-cycle uint)
  (amount-won uint)
))

;; Events
(define-event lottery-activated (pox-cycle uint))
(define-event participant-joined (participant principal) (amount uint) (pox-cycle uint))
(define-event winner-recorded (winner principal) (pox-cycle uint) (amount-won uint))

;; Public functions
(define-public (activate-lottery (pox-cycle uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u1))
    (asserts! (not (var-get is-active)) (err u2))
    (asserts! (> pox-cycle (var-get current-pox-cycle)) (err u3))
    
    (var-set current-pox-cycle pox-cycle)
    (var-set is-active true)
    (emit-event lottery-activated pox-cycle)
    (ok true)
  )
)

(define-public (join-lottery (amount uint))
  (begin
    (asserts! (var-get is-active) (err u4))
    (asserts! (>= amount MIN_STACK_AMOUNT) (err u5))
    
    ;; Check if user already participated in this cycle
    (let ((existing-entry (map-get? participants tx-sender)))
      (if (is-some existing-entry)
        (err u6) ;; Already participated
        (begin
          ;; Transfer STX from user to contract for stacking
          (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
          
          ;; Stack STX for the current PoX cycle
          (try! (stx-stack amount (as-contract tx-sender) (var-get current-pox-cycle)))
          
          ;; Record participation
          (map-set participants tx-sender (tuple
            (amount amount)
            (entry-block (block-height))
          ))
          
          (emit-event participant-joined tx-sender amount (var-get current-pox-cycle))
          (ok true)
        )
      )
    )
  )
)

(define-public (record-winner (winner principal) (amount-won uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u1))
    (asserts! (var-get is-active) (err u7))
    
    ;; Record the winner
    (map-set winners winner (tuple
      (pox-cycle (var-get current-pox-cycle))
      (amount-won amount-won)
    ))
    
    ;; Deactivate current lottery
    (var-set is-active false)
    
    (emit-event winner-recorded winner (var-get current-pox-cycle) amount-won)
    (ok true)
  )
)

(define-public (withdraw-stx (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) (err u1))
    (try! (stx-transfer? amount (as-contract tx-sender) tx-sender))
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-current-pox-cycle)
  (var-get current-pox-cycle)
)

(define-read-only (get-is-active)
  (var-get is-active)
)

(define-read-only (get-participant (participant principal))
  (map-get? participants participant)
)

(define-read-only (get-winner (winner principal))
  (map-get? winners winner)
)

(define-read-only (get-min-stack-amount)
  MIN_STACK_AMOUNT
)

;; Get all participants for current cycle
(define-read-only (get-all-participants)
  (map-keys participants)
) 