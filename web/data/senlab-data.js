window.SENLAB_DATA = {
  "meta": {
    "name": "SenLab Demo",
    "paper_count": 2,
    "theme_count": 4
  },
  "papers": [
    {
      "work_id": "einav-2015-response-drug-expenditure",
      "title": "THE RESPONSE OF DRUG EXPENDITURE TO NONLINEAR CONTRACT DESIGN: EVIDENCE FROM MEDICARE PART D*",
      "year": 2015,
      "field": "health-economics",
      "subfield": "applied-micro",
      "paper_paradigm": "empirical_structural",
      "research_question": "How do Medicare Part D beneficiaries respond to nonlinear out-of-pocket drug prices created by the donut hole, and what would happen if the coverage gap were filled?",
      "why_it_matters": "The paper studies a central health-economics question: how insurance contract design shapes utilization and welfare-relevant spending behavior.",
      "core_object": "Prescription drug demand under nonlinear insurance contracts in Medicare Part D.",
      "approach": "Descriptive bunching evidence around the donut hole kink combined with a simple dynamic model of drug use and counterfactual policy analysis.",
      "main_claim": "Filling the donut hole increases annual drug spending, but a meaningful share of the response reflects anticipatory behavior and cross-year substitution rather than pure within-year moral hazard.",
      "why_in_my_db": "This paper is reusable as a policy-design reference, a nonlinear pricing case, a bunching-style empirical pattern, and a health-insurance demand benchmark.",
      "ratings": {
        "dao": 5,
        "fa": 4,
        "shi": 5,
        "shu": 5,
        "qi": 5,
        "subjective": 5
      },
      "rating_notes": {
        "dao": "The paper answers a first-order question about insurance design and utilization.",
        "fa": "The empirical logic is strong, though some interpretation depends on modeling assumptions in the counterfactual stage.",
        "shi": "Medicare Part D provides a rare, policy-salient nonlinear budget set with excellent variation.",
        "shu": "The paper combines descriptive evidence, dynamic modeling, and policy counterfactuals in a disciplined sequence.",
        "qi": "Its contract-design setting, empirical pattern, and policy framing are highly reusable.",
        "subjective": "It is directly relevant for health-economics, insurance design, and policy evaluation work."
      },
      "one_line_judgment": "A high-value benchmark on nonlinear insurance contracts, demand response, and policy counterfactual analysis.",
      "themes": [
        {
          "theme_id": "drug-demand-under-insurance",
          "name": "Drug Demand Under Insurance"
        },
        {
          "theme_id": "nonlinear-insurance-contracts",
          "name": "Nonlinear Insurance Contracts"
        }
      ],
      "excerpts": [
        {
          "excerpt_id": "einav-2015-response-drug-expenditure-ex-001",
          "location": "Abstract",
          "topic": "counterfactual",
          "quote_or_paraphrase": "The baseline model implies that filling the donut hole raises annual drug spending by about $150, or about 8 percent.",
          "why_this_matters": "This is the headline quantitative policy result and anchors later citation lenses."
        },
        {
          "excerpt_id": "einav-2015-response-drug-expenditure-ex-002",
          "location": "Introduction",
          "topic": "identification_logic",
          "quote_or_paraphrase": "The paper exploits the kink created by the donut hole to document excess mass and changes in claim timing around the threshold.",
          "why_this_matters": "This excerpt captures the empirical logic behind the descriptive response evidence."
        }
      ],
      "lenses": [
        {
          "lens_id": "einav-2015-response-drug-expenditure-lens-method",
          "theme_id": "nonlinear-insurance-contracts",
          "lens_type": "method",
          "claim": "Bunching and claim timing around a contract kink can reveal behavioral response to nonlinear prices.",
          "interpretation": "Use the paper as a case of extracting demand information from nonlinear budget sets and administrative timing data.",
          "overclaim_risk": "The paper is not a generic reduced-form bunching design; its structural layer matters for some conclusions.",
          "safer_formulation": "The paper shows how descriptive kink evidence can be combined with a dynamic model to study nonlinear price response."
        },
        {
          "lens_id": "einav-2015-response-drug-expenditure-lens-policy",
          "theme_id": "nonlinear-insurance-contracts",
          "lens_type": "policy",
          "claim": "Nonlinear insurance contracts can meaningfully distort the timing and level of medical spending.",
          "interpretation": "Use the paper as evidence that beneficiaries respond to sharp changes in marginal price created by coverage design.",
          "overclaim_risk": "Do not generalize the exact magnitude outside the Medicare Part D institutional setting.",
          "safer_formulation": "In Medicare Part D, beneficiaries exhibit economically meaningful responses to the donut-hole price increase."
        }
      ],
      "markdown": "---\nwork_id: einav-2015-response-drug-expenditure\ncanonical_version_id: einav-2015-response-drug-expenditure-uploaded\ntitle: THE RESPONSE OF DRUG EXPENDITURE TO NONLINEAR CONTRACT DESIGN: EVIDENCE FROM MEDICARE PART D*\nauthors: Liran Einav, Amy Finkelstein, Paul Schrimpf\nyear: 2015\npublication_status: published_version\njournal_or_series: Quarterly Journal of Economics\ndoi: 10.1093/qje/qjv005\nfield: health-economics\nsubfield: applied-micro\npaper_paradigm: empirical_structural\nstatus: seeded_demo\ntags: [nonlinear-pricing, medicare-part-d, health-insurance, bunching, counterfactual]\n---\n\n# Paper Card\n\n## Identity\n\n- Work ID: `einav-2015-response-drug-expenditure`\n- Canonical Version ID: `einav-2015-response-drug-expenditure-uploaded`\n\n## Common Core\n\n### Research Question\nHow do beneficiaries respond to nonlinear out-of-pocket prices in Medicare Part D, and how much spending would rise if the donut hole were filled?\n\n### Why It Matters\nThe paper identifies how contract design affects utilization in health insurance, a core issue for both positive analysis and policy design.\n\n### Core Object\nDrug spending choices under nonlinear insurance coverage.\n\n### Approach\nThe paper combines descriptive evidence around the donut hole kink with a dynamic model that quantifies responses over the full budget set.\n\n### Main Claim\nFilling the donut hole increases spending, but the gross increase partly reflects anticipatory behavior and cross-year substitution.\n\n### Why In My Database\nIt is a reusable benchmark for nonlinear price response, insurance design, bunching around a contract kink, and policy counterfactual reasoning.\n\n## Paradigm-Specific Analysis\n\n### Empirical Branch\n\n#### Institutional Setting\nMedicare Part D creates a nonlinear coverage schedule with a well-known donut hole where marginal prices rise sharply.\n\n#### Data Source\nDetailed microdata from a 20 percent random sample of Medicare Part D beneficiaries from 2007 to 2009.\n\n#### Unit of Observation\nIndividual beneficiaries and their prescription-drug claims over the plan year.\n\n#### Sample\nMedicare Part D enrollees with observed contract characteristics and claims histories.\n\n#### Outcome Variables\nAnnual drug spending, claim timing, and spending behavior around the donut hole threshold.\n\n#### Treatment Or Variation\nThe key variation comes from the nonlinear contract and the discontinuous change in generosity at the coverage-gap kink.\n\n#### Identification Logic\nThe descriptive evidence uses excess mass and claim-timing behavior around the kink; the structural component maps these responses into counterfactual spending effects.\n\n#### Main Results\nIn the baseline model, filling the donut hole raises annual drug spending by roughly $150, around 8 percent.\n\n#### Mechanism Evidence\nThe timing patterns suggest anticipatory behavior within the year, and the extension indicates an important role for cross-year substitution.\n\n#### Counterfactual Or Policy Exercise\nThe paper studies the spending effects of closing the donut hole, as required under the Affordable Care Act.\n\n### Theory Branch\n\n#### Players\nNot the primary branch for this paper.\n\n## Limitations\nThe counterfactual magnitudes depend on the dynamic specification, and the cross-year substitution extension is intentionally stylized.\n\n## Theme Links\n- `nonlinear-insurance-contracts`\n- `drug-demand-under-insurance`\n\n## Ratings\n\n### Dao\n- Score: 5\n- Note: The question is policy-relevant and conceptually central for insurance design.\n\n### Fa\n- Score: 4\n- Note: The descriptive evidence is strong, though some conclusions depend on model structure.\n\n### Shi\n- Score: 5\n- Note: The institutional setting provides unusually strong leverage.\n\n### Shu\n- Score: 5\n- Note: The paper executes the empirical and model-based parts with discipline.\n\n### Qi\n- Score: 5\n- Note: The setting, data logic, and contract design are highly reusable.\n\n### Subjective\n- Score: 5\n- Note: It is directly useful for health-economics and policy-evaluation work.\n\n### One-Line Judgment\nA benchmark paper on nonlinear insurance contracts and counterfactual health-policy analysis.\n\n## TODO_VERIFY\n- Confirm exact sample construction details from the body of the paper.\n- Confirm whether the uploaded PDF is the final published formatting or a post-processed copy.\n"
    },
    {
      "work_id": "kamenica-2011-bayesian-persuasion",
      "title": "Bayesian Persuasion",
      "year": 2011,
      "field": "microeconomic-theory",
      "subfield": "information-design",
      "paper_paradigm": "theory",
      "research_question": "When can a sender profitably persuade a rational Bayesian receiver by choosing the receiver's information structure?",
      "why_it_matters": "The paper creates the canonical information-design framework behind modern persuasion theory in economics.",
      "core_object": "Strategic design of signals in a symmetric-information sender-receiver setting.",
      "approach": "General sender-receiver model with arbitrary states and actions, reformulated as an optimization over posterior distributions.",
      "main_claim": "A sender can often benefit from persuasion even when the receiver understands the sender's motives, and optimal persuasion can be characterized through feasible posterior beliefs.",
      "why_in_my_db": "This is a core theory reference for information design, mechanism intuition, and research migration across political economy, marketing, law, and platform settings.",
      "ratings": {
        "dao": 5,
        "fa": 5,
        "shi": 4,
        "shu": 5,
        "qi": 5,
        "subjective": 4
      },
      "rating_notes": {
        "dao": "The paper asks a foundational question about strategic information transmission.",
        "fa": "The model logic is clean and the posterior reformulation is internally powerful.",
        "shi": "It launched a major research direction, though its value depends less on one empirical window than on conceptual generality.",
        "shu": "The execution is elegant and the examples are disciplined.",
        "qi": "The framework is extremely reusable across many fields.",
        "subjective": "It is highly useful when theory or mechanism framing matters, though not every applied project will need it directly."
      },
      "one_line_judgment": "A canonical information-design paper with broad reusable value across theory and applied mechanism work.",
      "themes": [
        {
          "theme_id": "information-design-persuasion",
          "name": "Information Design and Persuasion"
        },
        {
          "theme_id": "strategic-communication",
          "name": "Strategic Communication"
        }
      ],
      "excerpts": [
        {
          "excerpt_id": "kamenica-2011-bayesian-persuasion-ex-001",
          "location": "Abstract",
          "topic": "core_claim",
          "quote_or_paraphrase": "A sender can strictly benefit from choosing the receiver's information structure even when the receiver is fully rational and aware of the sender's motives.",
          "why_this_matters": "This is the canonical high-level claim of Bayesian persuasion."
        },
        {
          "excerpt_id": "kamenica-2011-bayesian-persuasion-ex-002",
          "location": "Introduction",
          "topic": "method",
          "quote_or_paraphrase": "The sender's problem can be reformulated as a search over posterior belief distributions whose expectation equals the prior.",
          "why_this_matters": "This is the key geometric insight that made the framework portable and powerful."
        }
      ],
      "lenses": [
        {
          "lens_id": "kamenica-2011-bayesian-persuasion-lens-opportunity",
          "theme_id": "strategic-communication",
          "lens_type": "opportunity",
          "claim": "The framework offers a reusable template for importing information design into applied institutional settings.",
          "interpretation": "Use the paper when generating new questions about disclosure, recommendation systems, litigation, or regulated information environments.",
          "overclaim_risk": "The paper is a framework paper, not direct evidence about any one empirical institution.",
          "safer_formulation": "The paper provides a tractable theory template that can be adapted to applied settings where agents control informational environments."
        },
        {
          "lens_id": "kamenica-2011-bayesian-persuasion-lens-theory",
          "theme_id": "information-design-persuasion",
          "lens_type": "theory",
          "claim": "Strategic control of information can change actions even without changing preferences or making transfers.",
          "interpretation": "Use the paper as the canonical theory reference for information-design-based persuasion.",
          "overclaim_risk": "Do not confuse persuasion through experiment design with cheap talk or ex post deception models.",
          "safer_formulation": "In the Bayesian persuasion framework, a sender can benefit by choosing an information structure that shifts receiver posteriors."
        }
      ],
      "markdown": "---\nwork_id: kamenica-2011-bayesian-persuasion\ncanonical_version_id: kamenica-2011-bayesian-persuasion-uploaded\ntitle: Bayesian Persuasion\nauthors: Emir Kamenica and Matthew Gentzkow\nyear: 2011\npublication_status: published_version\njournal_or_series: American Economic Review\ndoi: 10.1257/aer.101.6.2590\nfield: microeconomic-theory\nsubfield: information-design\npaper_paradigm: theory\nstatus: seeded_demo\ntags: [information-design, persuasion, sender-receiver, posterior-beliefs, mechanism]\n---\n\n# Paper Card\n\n## Identity\n\n- Work ID: `kamenica-2011-bayesian-persuasion`\n- Canonical Version ID: `kamenica-2011-bayesian-persuasion-uploaded`\n\n## Common Core\n\n### Research Question\nWhen can a sender manipulate a receiver's action by optimally designing the information she sees?\n\n### Why It Matters\nThe paper establishes the baseline theory of information design and persuasion with rational Bayesian receivers.\n\n### Core Object\nSignal design in a sender-receiver game with common priors and conflicting preferences.\n\n### Approach\nThe paper reformulates the sender's problem as a search over posterior distributions whose expectation equals the prior.\n\n### Main Claim\nEven with full awareness of the sender's motives, a Bayesian receiver can be profitably persuaded through the sender's choice of signal structure.\n\n### Why In My Database\nIt is a canonical theory anchor for information design, mechanism intuition, and theme-building across many subfields.\n\n## Paradigm-Specific Analysis\n\n### Theory Branch\n\n#### Players\nA sender who chooses a signal structure and a receiver who takes an action after observing a signal realization.\n\n#### State Space\nAn arbitrary state space with a common prior shared by sender and receiver.\n\n#### Action Space\nAn arbitrary action space available to the receiver after she updates beliefs.\n\n#### Information Structure\nThe sender chooses an experiment or signal that induces posterior beliefs over the state.\n\n#### Timing\nThe state is drawn, the sender commits to an information structure, the receiver observes the signal realization, and then acts.\n\n#### Objective Functions\nThe sender and receiver have state-dependent preferences over the receiver's action.\n\n#### Solution Concept\nOptimal persuasion is characterized as an optimization over feasible distributions of posterior beliefs satisfying Bayes plausibility.\n\n#### Key Propositions\nThe existence of beneficial persuasion and the sender-optimal signal can be characterized through the geometry of posterior distributions.\n\n#### Conditions\nThe sender cannot lie about realized signals once the signal structure is chosen.\n\n#### Comparative Statics\nThe value of persuasion depends on the alignment of sender and receiver preferences and the curvature of the sender's value function over beliefs.\n\n#### Applications\nThe paper discusses litigators, lobbyists, salespeople, and broader strategic communication environments.\n\n### Empirical Branch\n\n#### Institutional Setting\nNot the primary branch for this paper.\n\n## Limitations\nThe model abstracts from ex post lying, richer dynamic communication, and some incentive-compatibility issues emphasized in other communication models.\n\n## Theme Links\n- `information-design-persuasion`\n- `strategic-communication`\n\n## Ratings\n\n### Dao\n- Score: 5\n- Note: The question is foundational and field-defining.\n\n### Fa\n- Score: 5\n- Note: The model logic and posterior reformulation are exceptionally clean.\n\n### Shi\n- Score: 4\n- Note: Its value comes from conceptual reach more than one institutional opportunity.\n\n### Shu\n- Score: 5\n- Note: The execution is elegant and highly disciplined.\n\n### Qi\n- Score: 5\n- Note: The framework is broadly reusable across many settings.\n\n### Subjective\n- Score: 4\n- Note: It is especially valuable when theory and mechanism framing matter.\n\n### One-Line Judgment\nA canonical information-design framework with unusually high long-run reuse value.\n\n## TODO_VERIFY\n- Confirm whether the uploaded PDF is the final AER version or a mirrored copy.\n"
    }
  ],
  "themes": [
    {
      "theme_id": "drug-demand-under-insurance",
      "name": "Drug Demand Under Insurance",
      "field": "health-economics",
      "status": "seeded_demo"
    },
    {
      "theme_id": "information-design-persuasion",
      "name": "Information Design and Persuasion",
      "field": "microeconomic-theory",
      "status": "seeded_demo"
    },
    {
      "theme_id": "nonlinear-insurance-contracts",
      "name": "Nonlinear Insurance Contracts",
      "field": "health-economics",
      "status": "seeded_demo"
    },
    {
      "theme_id": "strategic-communication",
      "name": "Strategic Communication",
      "field": "microeconomic-theory",
      "status": "seeded_demo"
    }
  ]
};
