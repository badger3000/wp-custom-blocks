/**
 * Get template blocks for a given pattern type
 */
export function getPatternTemplate(patternType) {
  // Default simple template
  if (!patternType || patternType === "default") {
    return [
      ["core/heading", {level: 3, content: "Tab Content"}],
      [
        "core/paragraph",
        {content: "Add your content here or choose from the block library."},
      ],
    ];
  }

  // Content-specific templates
  switch (patternType) {
    case "feature-grid":
      return [
        ["core/heading", {textAlign: "center", content: "Key Features"}],
        [
          "core/paragraph",
          {
            align: "center",
            content:
              "Explore the powerful features that make our product stand out.",
          },
        ],
        [
          "core/columns",
          {},
          [
            [
              "core/column",
              {},
              [
                [
                  "core/image",
                  {align: "center", width: 64, height: 64, sizeSlug: "full"},
                ],
                [
                  "core/heading",
                  {textAlign: "center", level: 4, content: "Easy Setup"},
                ],
                [
                  "core/paragraph",
                  {
                    align: "center",
                    content:
                      "Get started in minutes with our intuitive configuration process.",
                  },
                ],
              ],
            ],
            [
              "core/column",
              {},
              [
                [
                  "core/image",
                  {align: "center", width: 64, height: 64, sizeSlug: "full"},
                ],
                [
                  "core/heading",
                  {textAlign: "center", level: 4, content: "Powerful Tools"},
                ],
                [
                  "core/paragraph",
                  {
                    align: "center",
                    content:
                      "Access advanced features that help you accomplish more in less time.",
                  },
                ],
              ],
            ],
            [
              "core/column",
              {},
              [
                [
                  "core/image",
                  {align: "center", width: 64, height: 64, sizeSlug: "full"},
                ],
                [
                  "core/heading",
                  {textAlign: "center", level: 4, content: "24/7 Support"},
                ],
                [
                  "core/paragraph",
                  {
                    align: "center",
                    content:
                      "Our team is always available to help you with any questions or issues.",
                  },
                ],
              ],
            ],
          ],
        ],
      ];

    case "media-showcase":
      return [
        [
          "core/media-text",
          {mediaPosition: "right", mediaType: "image"},
          [
            ["core/heading", {level: 3, content: "Product Showcase"}],
            [
              "core/paragraph",
              {
                content:
                  "This versatile layout is perfect for highlighting product features, benefits, and specifications.",
              },
            ],
            [
              "core/list",
              {},
              [
                ["core/list-item", {content: "High-quality materials"}],
                ["core/list-item", {content: "Durable construction"}],
                ["core/list-item", {content: "Modern design"}],
                ["core/list-item", {content: "Multiple color options"}],
              ],
            ],
            [
              "core/buttons",
              {},
              [
                [
                  "core/button",
                  {},
                  [["core/button__link", {content: "Learn More"}]],
                ],
              ],
            ],
          ],
        ],
      ];

    case "faq-accordion":
      return [
        [
          "core/heading",
          {textAlign: "center", content: "Frequently Asked Questions"},
        ],
        [
          "core/paragraph",
          {
            align: "center",
            content:
              "Find answers to the most common questions about our services.",
          },
        ],
        [
          "core/details",
          {},
          [
            ["core/summary", {content: "How do I get started?"}],
            [
              "core/paragraph",
              {
                content:
                  "Getting started is easy! Simply create an account on our website and follow the step-by-step guide.",
              },
            ],
          ],
        ],
        [
          "core/details",
          {},
          [
            ["core/summary", {content: "What payment methods do you accept?"}],
            [
              "core/paragraph",
              {
                content:
                  "We accept all major credit cards, PayPal, and bank transfers.",
              },
            ],
          ],
        ],
        [
          "core/details",
          {},
          [
            ["core/summary", {content: "Is there a free trial available?"}],
            [
              "core/paragraph",
              {
                content:
                  "Yes! We offer a 14-day free trial with full access to all features.",
              },
            ],
          ],
        ],
      ];

    default:
      return [
        ["core/heading", {level: 3, content: "Tab Content"}],
        [
          "core/paragraph",
          {content: "Add your content here or choose from the block library."},
        ],
      ];
  }
}
